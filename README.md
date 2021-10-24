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

The pipeline will perform the following actions:
 1. lint the front-end and back-end code
 2. build the front-end and back-end code
 3. scan code and dependency usage for security vulnerabilities
 4. publish artifacts to necessary sources
 5. provision the necessary infrastructure
 6. deploy to the infrastructure
 7. test the running application with a smoke test
 8. upgrade the new deployment
 9. retire the previous deployment

### Pick a deployment type -- either rolling deployment or blue/green deployment.
I've used blue/green deployment for this pipeline. Blue/green deployment makes more sense to me for providing high availability applications. If I'm automatically building and deploying the latest content every day or week, then I'd like to make sure those changes are safely deployed and working before replacing the current deployment.

## Phase 2: Use Circle CI to implement a blue/green deployment.
The Circle CI pipeline configuration can be found in the standard `.circleci` directory at the root level of this repository. This configuration provisions new infrastructure for the built code and only retires existing infrastructure (blue deployment) when the new infrastructure (green deployment) is found to be stable. 

## Phase 3: Pick AWS Kubernetes as a Service, or build your own Kubernetes cluster.
For this pipeline an EKS cluster is created using `eksctl` for each iteration. Each deployment has its own cluster instead of updating an existing cluster. I did this to isolate the deployments from one another and allow users of the pipeline to launch concurrent instances if desired.

By default `eksctl` will create a cluster that uses EC2 instances under the hood.

## Phase 4: Build your pipeline

### Include your Dockerfile/source code in the Git repository.
The Dockerfile for the back-end image can be found at `backend/Dockerfile`. This image is the only image that needs to be built for this pipeline. The front-end code is built and uploaded to an S3 bucket during the pipeline.

### Include with your Linting step both a failed Linting screenshot and a successful Linting screenshot.
These screenshots can be found in the `screenshots/pipeline/linting` directory. The files are named `success.png` and `failure.png`, for the success and failure cases, respectively.

Screenshots showcasing failed and successful linting steps in the pipeline can be found in the `screenshots/pipeline/linting` directory. The following files are in this directory.
  * `failed_lint_frontend.png`: A linting failure for the front-end code.
  * `successful_lint_frontend.png`: A passing lint for the front-end code.
  * `failed_lint_backend.png`: A linting failure for the back-end code.
  * `successful_lint_backend.png`: A passing lint for the back-end code.

## Phase 5: Test your pipeline

### Perform Builds on your Pipeline
Screenshots showcasing failed and successful builds can be found in the `screenshots/pipeline/build` directory. The following files are in this directory:
  * `failed_build_frontend.png`: A pipeline build that failed due to some error in the front-end code.
  * `failed_build_backend.png`: A pipeline build that failed due to some error in the back-end code.
  * `successful_build.png`: A pipeline build that successfully completed all steps.

Screenshots showcasing the active deployment can be found in the `screenshots/deployment` directory. The following files are in this directory:
  * `frontend.png`: The front-end application (presented by CloudFront) of the new green deployment.
  * `cloudformation_stacks.png`: The CloudFormation stacks that are backing the full stack application.