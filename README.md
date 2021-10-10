# Udacity AWS DevOps Capstone

For my capstone project, I've updated an old project of mine to use the things I learned in the
Udacity DevOps course.

The project that's been updated is my PlateSearcher application. This application checks for available license plates in the states of Virginia and Pennsylvania on behalf of the user, then persists them to a database to allow for more complicated queries.

  * A front-end user interface available on the web.
  * A back-end REST API that can be communicated with over the internet.
  * A collection of workers that periodically poll gold-copy services to updated persisted data.

## Phase 1: Propose and Scope the Project

### Plan what your pipeline will look like.
For my pipeline I've used Circle CI. I've worked with Jenkins quite a bit, and have even created a pipeline for building the front-end application, but I've enjoyed working with Circle CI during this course.

### Pick a deployment type -- either rolling deployment or blue/green deployment.
I've used blue/green deployment for this pipeline. Blue/green deployment makes more sense to me for providing high availability applications. If I'm automatically building and deploying the latest content every day or week, then I'd like to make sure those changes are safely deployed and working before replacing the current deployment.

## Phase 2: Use Circle CI to implement a blue/green deployment.
The Circle CI pipeline configuration can be found in the standard `.circleci` directory at the root level of this repository.

## Phase 3: Pick AWS Kubernetes as a Service, or build your own Kubernetes cluster.
This phase kind of confused me because it states that Ansible or CloudFormation can be used to build the Kubernetes cluster, but an assembly of EC2 instances isn't the same as Kubernetes.

## Phase 4: Build your pipeline

### Include your Dockerfile/source code in the Git repository.

### Include with your Linting step both a failed Linting screenshot and a successful Linting screenshot.
These screenshots can be found in the `screenshots/pipeline/linting` directory. The files are named `success.png` and `failure.png`, for the success and failure cases, respectively.

## Phase 5: Test your pipeline

### Perform Builds on your Pipeline
Screenshots showcasing failed and successful builds can be found in the `screenshots/pipeline/build` directory. The following files are in this directory:
  * `failed_build_frontend.png`: A pipeline build that failed due to some error in the front-end code.
  * `failed_build_backend.png`: A pipeline build that failed due to some error in the back-end code.
  * `successful_build.png`: A pipeline build that successfully completed all steps.

Screenshots showcasing the blue/green deployment can be found in the `screenshots/pipeline/deployment` directory. The following files are in this directory:
  * `prior_infrastructure.png`: The infrastructure (presented by CloudFormation) of the blue, or prior deployment.
  * `new_infrastructure.png`: The infrastructure (presented by CloudFormation) of the green, or new deployment.