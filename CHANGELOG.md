<a name="0.2.0"></a>
# [0.2.0](https://github.com/garden-io/garden/compare/v0.1.2...v0.2.0) (2018-06-14)


### Bug Fixes

* broken `npm run dev` after package.json changes ([8bd6217](https://github.com/garden-io/garden/commit/8bd6217))
* **cli:** enforce single character option aliases ([a49e799](https://github.com/garden-io/garden/commit/a49e799))
* don't run dist script on every npm install ([c73f5e1](https://github.com/garden-io/garden/commit/c73f5e1))
* **ci:** only do clean install from package-lock ([3c44191](https://github.com/garden-io/garden/commit/3c44191))
* **cli:** add missing shebang line in garden binary ([632925d](https://github.com/garden-io/garden/commit/632925d))
* error in `Module.getVersion()` ([6491678](https://github.com/garden-io/garden/commit/6491678))
* malformed output from `ctx.getStatus()` ([#134](https://github.com/garden-io/garden/issues/134)) ([d222721](https://github.com/garden-io/garden/commit/d222721))
* pin npm version in CircleCI ([206d946](https://github.com/garden-io/garden/commit/206d946))
* **container:** build issue where Dockerfile is copied or generated ([c0186d9](https://github.com/garden-io/garden/commit/c0186d9))
* **core:** potential race-condition when parsing modules ([944e150](https://github.com/garden-io/garden/commit/944e150))
* **ctx:** better error.log output from `processModules()` ([b0eb86e](https://github.com/garden-io/garden/commit/b0eb86e))
* **k8s:** better error message when kubectl fails ([41f1482](https://github.com/garden-io/garden/commit/41f1482))
* **k8s:** incorrect use of execa ([cecbaa3](https://github.com/garden-io/garden/commit/cecbaa3))
* **logger:** remove unnecessary call to stopLoop ([db84561](https://github.com/garden-io/garden/commit/db84561))
* **vsc:** handle weird stat behavior by wrapping it ([df11647](https://github.com/garden-io/garden/commit/df11647))


### Code Refactoring

* rename project.global to project.environmentDefaults ([#131](https://github.com/garden-io/garden/issues/131)) ([3ebe1dc](https://github.com/garden-io/garden/commit/3ebe1dc))


### Features

* **build:** Handle config changes in auto-reload. ([9d9295f](https://github.com/garden-io/garden/commit/9d9295f))
* **k8s:** add helm module type ([122e6dd](https://github.com/garden-io/garden/commit/122e6dd))


### Performance Improvements

* got rid of all synchronous subprocess and filesystem calls ([9b62424](https://github.com/garden-io/garden/commit/9b62424))
* implemented caching of module version ([e451f7a](https://github.com/garden-io/garden/commit/e451f7a))


### BREAKING CHANGES

* Existing garden.yml files will need to be updated if they use the
project.global key.



<a name="0.2.0"></a>
# [0.2.0](https://github.com/garden-io/garden/compare/v0.1.2...v0.2.0) (2018-06-14)


### Bug Fixes

* broken `npm run dev` after package.json changes ([8bd6217](https://github.com/garden-io/garden/commit/8bd6217))
* **cli:** enforce single character option aliases ([a49e799](https://github.com/garden-io/garden/commit/a49e799))
* don't run dist script on every npm install ([c73f5e1](https://github.com/garden-io/garden/commit/c73f5e1))
* **ci:** only do clean install from package-lock ([3c44191](https://github.com/garden-io/garden/commit/3c44191))
* **cli:** add missing shebang line in garden binary ([632925d](https://github.com/garden-io/garden/commit/632925d))
* error in `Module.getVersion()` ([6491678](https://github.com/garden-io/garden/commit/6491678))
* malformed output from `ctx.getStatus()` ([#134](https://github.com/garden-io/garden/issues/134)) ([d222721](https://github.com/garden-io/garden/commit/d222721))
* pin npm version in CircleCI ([206d946](https://github.com/garden-io/garden/commit/206d946))
* **container:** build issue where Dockerfile is copied or generated ([c0186d9](https://github.com/garden-io/garden/commit/c0186d9))
* **core:** potential race-condition when parsing modules ([944e150](https://github.com/garden-io/garden/commit/944e150))
* **ctx:** better error.log output from `processModules()` ([b0eb86e](https://github.com/garden-io/garden/commit/b0eb86e))
* **k8s:** better error message when kubectl fails ([41f1482](https://github.com/garden-io/garden/commit/41f1482))
* **k8s:** incorrect use of execa ([cecbaa3](https://github.com/garden-io/garden/commit/cecbaa3))
* **logger:** remove unnecessary call to stopLoop ([db84561](https://github.com/garden-io/garden/commit/db84561))
* **vsc:** handle weird stat behavior by wrapping it ([df11647](https://github.com/garden-io/garden/commit/df11647))


### Code Refactoring

* rename project.global to project.environmentDefaults ([#131](https://github.com/garden-io/garden/issues/131)) ([3ebe1dc](https://github.com/garden-io/garden/commit/3ebe1dc))


### Features

* **build:** Handle config changes in auto-reload. ([9d9295f](https://github.com/garden-io/garden/commit/9d9295f))
* **k8s:** add helm module type ([122e6dd](https://github.com/garden-io/garden/commit/122e6dd))


### Performance Improvements

* got rid of all synchronous subprocess and filesystem calls ([9b62424](https://github.com/garden-io/garden/commit/9b62424))
* implemented caching of module version ([e451f7a](https://github.com/garden-io/garden/commit/e451f7a))


### BREAKING CHANGES

* Existing garden.yml files will need to be updated if they use the
project.global key.



<a name="0.1.2"></a>
## [0.1.2](https://github.com/garden-io/garden/compare/v0.1.1-0...v0.1.2) (2018-06-02)



### Bug Fixes

* **utils:** gulp dev dependencies and update util/index ([9e65f02](https://github.com/garden-io/garden/commit/9e65f02))
* add missing prepublish step ([a1dbde9](https://github.com/garden-io/garden/commit/a1dbde9))
* incorrect bin link in package.json ([237ce85](https://github.com/garden-io/garden/commit/237ce85))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/garden-io/garden/compare/0766b56...v0.1.0) (2018-05-31)

First release!
