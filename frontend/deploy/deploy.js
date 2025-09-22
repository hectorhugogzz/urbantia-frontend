const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 1. Accept the env parameter from the command line (e.g., 'dev', 'prod')
const env = process.argv[2];
if (!env) {
    console.error("Error: Environment name is required.");
    console.log("Usage: node deploy.js <env>");
    process.exit(1);
}

try {
    // 2. Construct the full path to the JSON configuration file
    const envFilePath = path.join(__dirname, 'env', `${env}.json`);
    if (!fs.existsSync(envFilePath)) {
        console.error(`Error: Configuration file not found at ${envFilePath}`);
        console.log(`Please make sure you have created a '${env}.json' file in the 'deploy/env/' directory.`);
        process.exit(1);
    }

    // 3. Load and parse the environment configuration from the JSON file
    const config = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    const { cloudRunConfig, envVars } = config;

    // 4. Build the gcloud deployment command string
    let deployCommand = `gcloud run deploy ${cloudRunConfig.serviceName} \\
        --source=${cloudRunConfig.source} \\
        --project=${cloudRunConfig.targetProject} \\
        --region=${cloudRunConfig.region} \\
        --platform=managed \\
        --memory=${cloudRunConfig.memory} \\
        --cpu=${cloudRunConfig.cpu} \\
        --concurrency=${cloudRunConfig.concurrency} \\
        --timeout=${cloudRunConfig.timeout} \\
        --min-instances=${cloudRunConfig.minInstances} \\
        --max-instances=${cloudRunConfig.maxInstances}`;

    // For a public website, allow unauthenticated access.
    // For an internal tool, you would remove this and set up IAM.
    deployCommand += ` \\
        --allow-unauthenticated`;
    
    // Add the mandatory service account for permissions
    if (cloudRunConfig.serviceAccount) {
        deployCommand += ` \\
        --service-account=${cloudRunConfig.serviceAccount}`;
    }

    // Add the VPC connector if it's specified in the config
    if (cloudRunConfig.vpcConnector) {
        deployCommand += ` \\
        --vpc-connector=${cloudRunConfig.vpcConnector}`;
    }

    // Format all environment variables into a single, comma-separated string
    const envVarsList = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`);
        
    if (envVarsList.length > 0) {
        deployCommand += ` \\
        --set-env-vars="${envVarsList.join(',')}"`;
    }

    // 5. Execute the command
    console.log("--------------------------------------------------");
    console.log(`Executing deployment for the [${env}] environment...`);
    console.log("--------------------------------------------------");
    
    // The { stdio: 'inherit' } option pipes the output from the gcloud command
    // directly to your terminal, so you can see the progress.
    execSync(deployCommand, { stdio: 'inherit' });
    
    console.log('\n✅ Cloud Run deployment successful!');

} catch (error) {
    console.error('\n❌ Error during Cloud Run deployment:', error.message);
    process.exit(1);
}