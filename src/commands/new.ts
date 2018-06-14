/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as inquirer from "inquirer"
import * as Joi from "joi"
import chalk from "chalk"
import { capitalize, camelCase } from "lodash"
import { parse, resolve, join } from "path"
import { pathExists, ensureDir, readdir, stat, writeFile } from "fs-extra"
import Bluebird = require("bluebird")

import {
  PluginContext,
} from "../plugin-context"
import {
  Command,
  CommandResult,
  StringParameter,
  ParameterValues,
} from "./base"
import dedent = require("dedent")
import { joiIdentifier } from "../types/common"
import { ValidationError, ParameterError } from "../exceptions"
import { EntryStyle } from "../logger/types"
import { ModuleConfig, BaseModuleSpec } from "../types/module"
import { defaultEnvironments, ProjectConfig } from "../types/project"
import { DeepPartial } from "../util"
import { safeDump } from "js-yaml"
import { ContainerModuleSpec } from "../plugins/container"
import { GcfModuleSpec } from "../plugins/google/google-cloud-functions"

export const newOptions = {
  "module-dirs": new StringParameter({
    help: "Relative path to modules directory (if any). Use comma as a separator to specify multiple directories",
  }),
}

export const newArguments = {
  projectName: new StringParameter({
    help: "The name of the project, (defaults to project root directory name)",
  }),
}

export type Args = ParameterValues<typeof newArguments>
export type Opts = ParameterValues<typeof newOptions>

type ModuleType = "container" | "function" | "npm-package"

type ModuleTypeTemplates = { [key in ModuleType]: (name: string) => Object }

interface ModuleTypeChoice extends inquirer.objects.ChoiceOption {
  value: ModuleType
}

interface NewModule {
  name: string
  path: string
  config: { module: Partial<ModuleConfig> }
}

const moduleTypeChoices: ModuleTypeChoice[] = [
  {
    name: "container",
    value: "container",
  },
  {
    name: `google-cloud-function (${chalk.red.italic("experimental")})`,
    value: "function",
  },
  {
    name: `npm package (${chalk.red.italic("experimental")})`,
    value: "npm-package",
  },
]

const moduleTypeTemplates: ModuleTypeTemplates = {
  container: (moduleName: string): DeepPartial<ContainerModuleSpec> => ({
    services: [
      {
        name: `${moduleName}-service`,
        ports: [{
          name: "http",
          containerPort: 8080,
        }],
        endpoints: [{
          paths: ["/"],
          port: "http",
        }],
      },
    ],
  }),
  function: (moduleName: string): DeepPartial<GcfModuleSpec> => ({
    functions: [{
      name: `${moduleName}-function`,
      entrypoint: camelCase(`${moduleName}-function`),
    }],
  }),
  "npm-package": () => ({}),
}

const projectTemplate = (name: string): Partial<ProjectConfig> => ({
  name,
  environments: defaultEnvironments,
})

const moduleTemplate = (name: string, type: string): Partial<BaseModuleSpec> => ({
  name,
  type,
  description: `${titleize(name)} ${noCase(type)}`,
})

export class NewCommand extends Command<typeof newArguments, typeof newOptions> {
  name = "new"
  alias = "n"
  help = "Creates scaffolding for a new Garden project."

  description = dedent`
    The New command walks the user through setting up a new Garden project and generates scaffolding based on user
    input.

    Examples:

        garden new # scaffolds a new Garden project in the current directory (project name defaults to directory name)
        garden new my-project # scaffolds a new Garden project named my-project in the current directory
        garden new my-project --module-dirs=. # scaffolds a new Garden project and looks for modules
        in the current directory
        garden new my-existing-project --module-dirs=services # scaffolds a new Garden project and looks for modules
        in the services directory
  `

  runWithoutConfig = true
  arguments = newArguments
  options = newOptions

  async action(ctx: PluginContext, args: Args, opts: Opts): Promise<CommandResult> {
    const { projectRoot } = ctx
    let modulesToInitialize: NewModule[] = []

    const projectName = validate(
      args.projectName ? args.projectName.trim() : parse(projectRoot).base,
      "project",
    )

    // Directories that contain modules
    let moduleDirs: string[] | null = null
    if (opts["module-dirs"]) {
      moduleDirs = opts["module-dirs"]
        .split(",")
        .map(dir => validate(dir, "module"))
        .map(dir => resolve(projectRoot, dir))
    }

    const pushModule = (name: string, type: string, path: string) => {
      const templateFn = moduleTypeTemplates[type]
      modulesToInitialize.push({
        name,
        path,
        config: {
          module: {
            ...moduleTemplate(name, type),
            ...templateFn(name),
          },
        },
      })
    }

    ctx.log.header({ emoji: "house_with_garden", command: "new" })
    ctx.log.info(`Initializing new project ${projectName}`)
    ctx.log.info("---------")
    // Stop logger while prompting
    ctx.log.stop()

    // If moduleDirs option provided we scan for modules in the modules parent dir(s) and add them one by one
    if (moduleDirs) {
      for (const dir of moduleDirs) {
        const exists = await pathExists(dir)
        if (!exists) {
          throw new ParameterError(`Module directory ${dir} not found`, {})
        }

        // The modules themselves
        const modulesInDir = await Bluebird.all(readdir(dir))
          .filter(async (file: string) => await isDir(join(dir, file)))
          .filter((file: string) => !isHidden(file))

        await Bluebird.each(modulesInDir, async moduleDirName => {
          const { type } = await existingModulePrompt(moduleDirName)
          if (type) {
            pushModule(moduleDirName, type, dir)
          }
        })
      }
    } else {
      const repeatAddModule = async (addedModules: string[] = []) => {
        let addModuleMessage
        if (addedModules.length < 1) {
          addModuleMessage = "Would you like to add a module to your project?"
        } else {
          addModuleMessage = `Add another module? (current modules: ${addedModules.join(",")})`
        }
        const { moduleName, type } = await newModulePrompt(addModuleMessage)

        if (type) {
          pushModule(moduleName, type, "")
          await repeatAddModule(addedModules.concat(moduleName))
        }
      }
      await repeatAddModule()
    }

    ctx.log.info("---------")
    const projectTask = ctx.log.info({ msg: "Setting up project", entryStyle: EntryStyle.activity })

    for (const module of modulesToInitialize) {
      const moduleTask = projectTask.info({
        msg: `Initializing module ${module.name}`,
        entryStyle: EntryStyle.activity,
      })
      const moduleDir = join(module.path, module.name)
      await ensureDir(moduleDir)
      const moduleYamlPath = join(moduleDir, "garden.yml")
      if (await pathExists(moduleYamlPath)) {
        moduleTask.setWarn(`Garden config file already exists for module ${moduleDir}, skipping`)
      } else {
        await writeFile(moduleYamlPath, safeDump(module.config, { noRefs: true, skipInvalid: true }))
        moduleTask.setSuccess()
      }
    }

    const projectYamlPath = join(projectRoot, "garden.yml")
    await writeFile(projectYamlPath, safeDump(
      projectTemplate(projectName),
      { noRefs: true, skipInvalid: true }),
    )

    projectTask.setSuccess()

    ctx.log.info("All set up! Be sure to check out our docs at `https://docs.garden.io`")

    return {}
  }
}

const UNIX_HIDDEN_REGEX = /(^|\/)\.[^\/\.]/g
const isHidden = (path: string): boolean => UNIX_HIDDEN_REGEX.test(path)
const isDir = async (absPath: string): Promise<boolean> => (await stat(absPath)).isDirectory()
const noCase = str => str.replace(/-|_/g, " ")
const titleize = str => capitalize(noCase(str))

async function existingModulePrompt(dir: string): Promise<inquirer.Answers> {
  const questions: inquirer.Questions = [
    {
      name: "initModule",
      message: `Add module config for ${chalk.italic(dir)}?`,
      type: "confirm",
    },
    {
      name: "type",
      message: "Module type",
      choices: moduleTypeChoices,
      when: ans => ans.initModule,
      type: "list",
    },
  ]
  return await inquirer.prompt(questions)
}

async function newModulePrompt(addModuleMessage: string): Promise<inquirer.Answers> {
  const questions: inquirer.Questions = [
    {
      name: "addModule",
      message: addModuleMessage,
      type: "confirm",
    },
    {
      name: "moduleName",
      message: "Enter module name",
      type: "input",
      validate: input => {
        try {
          Joi.attempt(input.trim(), joiIdentifier())
        } catch (err) {
          return `Invalid module name, please try again\nError: ${err.message}`
        }
        return true
      },
      filter: input => input.trim(),
      when: ans => ans.addModule,
    },
    {
      name: "type",
      message: "Module type",
      choices: moduleTypeChoices,
      when: ans => ans.moduleName,
      type: "list",
    },
  ]
  return await inquirer.prompt(questions)
}

function validate(name: string, context: string) {
  try {
    Joi.attempt(name, joiIdentifier())
  } catch ({ message }) {
    throw new ValidationError(`${name} is an invalid ${context} name`, { message })
  }
  return name
}
