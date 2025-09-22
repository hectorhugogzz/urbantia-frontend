# Sales Agent Frontend

This project contains the frontend application for the Sales Automation Agent. It is a Next.js application that provides a user interface for sales team members to log in and generate quotes.

## Project Structure

-   `/app`: Contains the Next.js source code, including pages, components, and the Dockerfile for containerization.
-   `/deploy`: Contains the deployment scripts and environment configuration files.
-   `/setup`: Contains the `setup_gcp_infra.sh` script to provision necessary cloud infrastructure.

## Prerequisites

1.  **Node.js** (v20 or later)
2.  **Google Cloud SDK (`gcloud`)** authenticated to your GCP account.
3.  **Docker** installed and running on your local machine.

## Setup & Configuration

1.  **Run the Infrastructure Script**: Execute the `setup/setup_gcp_infra.sh` script to create the necessary service accounts, Artifact Registry repository, and enable APIs.

2.  **Follow Firebase Setup Guide**: Read the instructions in `QUICKSTAR-FIREBASE.md` for a detailed, step-by-step guide on connecting to the centralized SSO Identity Platform.

3.  **Configure Deployment Environments**:
    -   This project manages environment variables for different deployments (e.g., dev, prod) in the `deploy/env/` directory.
    -   Open the relevant file (e.g., `deploy/env/dev.json` for local development, `deploy/env/prod.json` for production).
    -   Update `targetProject`, `region`, and `serviceAccount` with the values from your GCP environment.
    -   Paste the corresponding values from the Firebase console into the `NEXT_PUBLIC_FIREBASE_...` variables.
    -   Crucially, you must also add the `NEXT_PUBLIC_FIREBASE_TENANT_ID`. See the `QUICKSTAR-FIREBASE.md` guide for detailed instructions on how to get this value.

## Local Development

The local development server uses the configuration from `deploy/env/dev.json` to automatically generate an `.env.local` file for you.

1.  **Configure `dev.json`**: Ensure the `cloudRunConfig` and `envVars` in `deploy/env/dev.json` are correctly filled out for your development setup. Make sure to include all `NEXT_PUBLIC_FIREBASE_*` variables, including the `TENANT_ID`.

2.  **Navigate to the app directory**:
    ```bash
    cd app
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    This command will first run a script to generate `app/.env.local` from `deploy/env/dev.json` and then start the Next.js server. The application will be available at `http://localhost:3000`.

## Deployment

1.  **Navigate to the project root**:
    ```bash
    cd ..
    ```

2.  **Execute the deployment script**:
    Run the `deploy.js` script, passing the target environment name as an argument. The available environments are `dev` and `prod`.

    ```bash
    # Example for deploying the 'prod' environment
    node deploy/deploy.js prod
    ```
    
    This script will use Cloud Build to build the Docker image from the `app` directory, push it to Artifact Registry, and deploy it to Cloud Run with the specified configuration.


## How It Works

The `deploy.js` script performs the following steps:

1.  **Reads Configuration**: Loads the `cloudRunConfig` and `envVars` from the specified environment file (e.g., `deploy/env/prod.json`).
2.  **Generates `.env` file**: Creates a temporary `.env` file in the `app` directory from the `envVars`. This file is included in the Docker image to be used by Next.js.
3.  **Submits to Cloud Build**: Runs a `gcloud builds submit` command.
    -   This command sends the `app` directory to Cloud Build.
    -   Cloud Build uses the `Dockerfile` to build the image.
    -   The built image is tagged and pushed to the Artifact Registry repository created by the setup script.
4.  **Deploys to Cloud Run**: Runs a `gcloud run deploy` command.
    -   This deploys the newly pushed image to Cloud Run.
    -   It passes the environment variables from the configuration file to the Cloud Run service.
    -   It configures the service with the VPC connector and service account specified in the configuration.
5.  **Cleans Up**: Deletes the temporary `.env` file from the local filesystem.