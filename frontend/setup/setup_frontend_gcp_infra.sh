#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# ==============================================================================
# GCP Infrastructure Setup for the Quote Creation Tool (SHARED VPC)
#
# Description:
# This script provisions all necessary GCP resources for the 'quote-creation-tool',
# including permissions required for a Shared VPC environment.
# ==============================================================================

# --- CONFIGURATION ---
# IMPORTANT: Fill these variables for the target environment before running.

export ENV="prod"
export REGION="us-east4" # The region where the Cloud Run service will be deployed

# The GCP Project ID where the tool will be deployed (Service Project)
export SERVICE_PROJECT_ID="prj-sie-cor-salesauto-${ENV}"

# --- NETWORKING CONFIGURATION (SHARED VPC) ---

# The Project ID of the Shared VPC Host Project.
export SHARED_VPC_HOST_PROJECT_ID="prj-sie-com-vpc-host-${ENV}"

# --- RESOURCE NAMING ---

# The name for the shared backend service account.
export TOOL_SA_NAME="sales-agent-backend-sa"

# The name for the secret that will store the Apps Script API key.
export SECRET_NAME="apps-script-api-key"

# --- END CONFIGURATION ---


# --- SCRIPT LOGIC ---
FULL_SA_NAME="${TOOL_SA_NAME}-${ENV}"
FULL_SA_EMAIL="${FULL_SA_NAME}@${SERVICE_PROJECT_ID}.iam.gserviceaccount.com"
PROJECT_NUMBER=$(gcloud projects describe ${SERVICE_PROJECT_ID} --format="value(projectNumber)")
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "--- Starting GCP setup for [${FULL_SA_NAME}] in Service Project [${SERVICE_PROJECT_ID}] ---"

# 1. Set Project
gcloud config set project "${SERVICE_PROJECT_ID}"
echo "✅ gcloud CLI configured to use project: ${SERVICE_PROJECT_ID}"
echo ""

# 2. Enable Required APIs in the Service Project
echo "Enabling required Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com \
  firestore.googleapis.com \
  secretmanager.googleapis.com \
  vpcaccess.googleapis.com
echo "✅ All necessary APIs enabled."
echo ""

# 3. Create Service Account for the Tool in the Service Project
echo "Checking for Service Account: ${FULL_SA_NAME}..."
if gcloud iam service-accounts describe "${FULL_SA_EMAIL}" >/dev/null 2>&1; then
  echo "ℹ️ Service Account already exists. Skipping creation."
else
  echo "Creating Service Account..."
  gcloud iam service-accounts create "${FULL_SA_NAME}" \
    --display-name="Sales Agent Backend Service Account (${ENV})"
  echo "✅ Service Account created."
fi
echo ""

# 4. Create Secret in Secret Manager in the Service Project
echo "Checking for Secret: ${SECRET_NAME}..."
if gcloud secrets describe "${SECRET_NAME}" >/dev/null 2>&1; then
  echo "ℹ️ Secret '${SECRET_NAME}' already exists. Skipping creation."
else
  echo "Creating Secret '${SECRET_NAME}'..."
  echo "placeholder-secret-value-change-me" | gcloud secrets create "${SECRET_NAME}" \
    --replication-policy="automatic" \
    --data-file=-
  echo "✅ Secret created. PLEASE UPDATE ITS VALUE IN THE GCP CONSOLE."
fi
echo ""

# 5. Grant Permissions within the Service Project
echo "Granting IAM roles to the Tool's Service Account (${FULL_SA_EMAIL}) in Service Project..."
# Permission to access Firestore
gcloud projects add-iam-policy-binding "${SERVICE_PROJECT_ID}" --member="serviceAccount:${FULL_SA_EMAIL}" --role="roles/datastore.user" > /dev/null
echo "  - Granted roles/datastore.user"

# Permission to access the secret at runtime
gcloud secrets add-iam-policy-binding "${SECRET_NAME}" --member="serviceAccount:${FULL_SA_EMAIL}" --role="roles/secretmanager.secretAccessor" > /dev/null
echo "  - Granted roles/secretmanager.secretAccessor"
echo ""

# 6. Grant Permissions to the Cloud Build Service Account in the Service Project
echo "Granting IAM roles to the Cloud Build Service Account in Service Project..."
gcloud projects add-iam-policy-binding "${SERVICE_PROJECT_ID}" --member="serviceAccount:${CLOUDBUILD_SA}" --role="roles/artifactregistry.writer" > /dev/null
echo "  - Granted roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding "${SERVICE_PROJECT_ID}" --member="serviceAccount:${CLOUDBUILD_SA}" --role="roles/run.admin" > /dev/null
echo "  - Granted roles/run.admin"
gcloud iam service-accounts add-iam-policy-binding "${FULL_SA_EMAIL}" --member="serviceAccount:${CLOUDBUILD_SA}" --role="roles/iam.serviceAccountUser" > /dev/null
echo "  - Granted roles/iam.serviceAccountUser"
echo ""

# 7. Grant Shared VPC Permissions on the Host Project
echo "Granting Shared VPC permissions on Host Project: ${SHARED_VPC_HOST_PROJECT_ID}..."
# Grant permission to the Tool's runtime SA to use the VPC network
gcloud projects add-iam-policy-binding "${SHARED_VPC_HOST_PROJECT_ID}" --member="serviceAccount:${FULL_SA_EMAIL}" --role="roles/compute.networkUser" > /dev/null
echo "  - Granted roles/compute.networkUser to the Tool's Service Account"

# Grant permission to the Cloud Build SA to use the VPC network during deployment
gcloud projects add-iam-policy-binding "${SHARED_VPC_HOST_PROJECT_ID}" --member="serviceAccount:${CLOUDBUILD_SA}" --role="roles/compute.networkUser" > /dev/null
echo "  - Granted roles/compute.networkUser to the Cloud Build Service Account"
echo ""


echo "--------------------------------------------------"
echo "✅ Automated script finished."
echo ""
echo "🔥 MANUAL ACTION REQUIRED: 🔥"
echo "1. Go to Secret Manager in the GCP Console for project '${SERVICE_PROJECT_ID}'."
echo "2. Find the secret named '${SECRET_NAME}'."
echo "3. Create a new version and paste your actual, secure API key as its value."
echo "--------------------------------------------------"
echo "Setup complete!"