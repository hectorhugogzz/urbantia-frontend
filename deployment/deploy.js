const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// --- Main Execution ---

try {
    // 1. Accept service type, service name, and environment from command line
    const [serviceType, serviceName, env] = process.argv.slice(2);
    if (!serviceType || !serviceName || !env) {
        console.error("Error: Service type, service name, and environment are required.");
        console.log("Usage: node deployment/deploy.js <serviceType> <serviceName> <env>");
        console.log("Example: node deployment/deploy.js tools quote-creation-tool dev");
        process.exit(1);
    }

    console.log(`--- Starting deployment for [${serviceName}] in [${env}] environment ---`);

    // 2. Construct paths based on monorepo structure
    const projectRoot = path.join(__dirname, '..');
    const servicePath = path.join(projectRoot, serviceType, serviceName);
    const configPath = path.join(servicePath, 'deploy_config', 'env', `${env}.json`);

    if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found at: ${configPath}`);
    }

    // 3. Load the service's specific deployment configuration
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const { cloudRunConfig, envVars } = config;
    
    // The source path for gcloud is the root of the service itself.
    const sourcePath = path.join(serviceType, serviceName);

    // 4. Build the gcloud deployment command string
    let command = [
        `gcloud run deploy ${cloudRunConfig.serviceName}`,
        `--source=${sourcePath}`,
        `--project=${cloudRunConfig.targetProject}`,
        `--region=${cloudRunConfig.region}`,
        '--platform=managed',
        `--memory=${cloudRunConfig.memory}`,
        `--cpu=${cloudRunConfig.cpu}`,
        `--concurrency=${cloudRunConfig.concurrency}`,
        `--timeout=${cloudRunConfig.timeout}`,
        `--min-instances=${cloudRunConfig.minInstances}`,
        `--max-instances=${cloudRunConfig.maxInstances}`,
    ];

    // For tools/agents, secure them. For frontend, allow unauthenticated.
    if (cloudRunConfig.allowUnauthenticated) {
        command.push('--allow-unauthenticated');
    } else {
        // By default, Cloud Run services require authentication.
        // We will manage access via IAM invoker roles.
    }
    
    if (cloudRunConfig.serviceAccount) {
        command.push(`--service-account=${cloudRunConfig.serviceAccount}`);
    }

    if (cloudRunConfig.vpcConnector) {
        command.push(`--vpc-connector=${cloudRunConfig.vpcConnector}`);
    }

    const envVarsList = Object.entries(envVars || {}).map(([key, value]) => `${key}=${value}`);
    if (envVarsList.length > 0) {
        command.push(`--set-env-vars="${envVarsList.join(',')}"`);
    }

    const deployCommand = command.join(' \\\n    ');

    // 5. Execute the command from the project root
    console.log("\nExecuting gcloud command:\n");
    console.log(deployCommand + "\n");
    execSync(deployCommand, { stdio: 'inherit', cwd: projectRoot });
    
    console.log(`\n✅ Deployment of [${serviceName}] successful!`);

} catch (error) {
    console.error(`\n❌ Error during deployment:`, error.message);
    process.exit(1);
}