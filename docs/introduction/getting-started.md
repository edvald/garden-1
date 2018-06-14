# Getting Started

This guide will walk you through setting up the Garden framework.


## Installation

### macOS

For Mac, we recommend the following steps to install Garden. You can also follow the manual installation
steps below if you prefer.

#### Step 1: Install homebrew

If you haven't already set up homebrew, please follow [their instructions](https://brew.sh/) to set it up.

#### Step 2: Docker and local Kubernetes
To install Docker, Kubernetes and kubectl, we strongly recommend Docker for Mac (edge version). 

_Note: you need to install the **edge version** of Docker for Mac in 
order to enable Kubernetes support._

Once installed, open the Docker for Mac preferences, go to the Kubernetes section, 
tick `Enable Kubernetes` and save. Please refer to their 
[installation guide](https://docs.docker.com/engine/installation/) for details.

Alternatively, you can use Minikube. We generally find it less stable and more hassle to 
configure and use, but we do fully support it on Mac if you have it running. Please look at our
[Minikube guide](../guides/minikube.md) for details.

#### Step 3: Install `garden-cli`

We have a Homebrew tap and package that you can use to easily install `garden-cli` and all dependencies:

```sh
brew tap garden-io/garden
brew install garden-cli
```

To later upgrade to the newest version, simply run `brew update` and then `brew upgrade garden-cli` 
(or `brew upgrade` to upgrade all your Homebrew packages).


### Linux / manual installation

You need the following dependencies on your local machine to use Garden:

* Node.js >= 8.x
* [Docker](https://docs.docker.com/)
* Git
* rsync
* [Watchman](https://facebook.github.io/watchman/docs/install.html)
* [Helm](https://github.com/kubernetes/helm)
* Local installation of Kubernetes and kubectl

#### Step 1: Docker
To install Docker, please follow the instructions in the [official documentation](https://docs.docker.com/install/).

#### Step 2: Local Kubernetes
For local Kubernetes, you can use [Minikube](https://github.com/kubernetes/minikube). Please see our 
[Minikube guide](../guides/minikube.md) for instructions.

#### Step 3: Install other dependencies

Use your preferred method or package manager to install `node` (version 8.x or higher), `git`, `rsync`, 
[Watchman](https://facebook.github.io/watchman/docs/install.html) and
[Helm](https://github.com/kubernetes/helm).

#### Step 4: Install `garden-cli`

Once you have the dependencies set up, install the Garden CLI via `npm`:

```sh
npm install -g garden-cli
```

To later upgrade to the newest version, run `npm install -g -U garden-cli`.


## Using the CLI

With the CLI installed, we can now try out a few commands using the [hello-world](https://github.com/garden-io/garden-examples/tree/master/hello-world) project from our Github [examples repository](https://github.com/garden-io/garden-examples). The example consists of a container service that runs an [Express](http://expressjs.com/) app, a serverless function, and an npm library package.

_Note: check if Kubernetes is running with `kubectl version`. You should see both a `Client Version` and a `Server Version` in the response. If not, please start it up before proceeding._

Clone the repo and change into the `hello-world`  directory:

```sh
$ git clone https://github.com/garden-io/garden-examples.git
$ cd examples/hello-world
```

First, let's check the environment status by running the following from the project root:

```sh
$ garden status
```

The response tells us how the environment is configured and the status of the providers. Next, we'll deploy the services with:

```sh
$ garden deploy
```

And that's it! The services are now running on the Garden framework. You can see for yourself by querying the `/hello` endpoint of the container with:

```sh
$ garden call hello-container/hello
```

Check out our [Commands guide](../guides/commands.md) for other features like auto-reload, streaming service logs, running tests and lots more, or see how a Garden project is configured from scratch in our [Simple Project](../guides/simple-project.md) guide.
