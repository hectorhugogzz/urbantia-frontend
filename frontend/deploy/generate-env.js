const fs = require('fs');
const path = require('path');

console.log('Generating .env.local from dev.json...');

try {
    // Determine the environment, default to 'dev' for local use
    const env = process.argv[2] || 'dev';
    const envFilePath = path.join(__dirname, 'env', `${env}.json`);
    const outputEnvPath = path.join(__dirname, '../app/.env.local');

    // Read the source JSON config file
    const config = JSON.parse(fs.readFileSync(envFilePath, 'utf8'));
    const { envVars } = config;

    // Convert the JSON envVars to the KEY=VALUE format
    const envFileContent = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    // Write the content to the app/.env.local file
    fs.writeFileSync(outputEnvPath, envFileContent);

    console.log(`✅ Successfully created app/.env.local from ${env}.json`);

} catch (error) {
    console.error('❌ Error generating .env.local file:', error.message);
    process.exit(1);
}