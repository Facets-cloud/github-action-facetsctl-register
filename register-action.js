const path = require('path');
const core = require('@actions/core');
const { exec } = require('child_process');

async function run() {
  try {
    const facetsctlBinary = path.join(__dirname, 'node_modules/@facets-cloud/facetsctl/bin/run');
    
    // Login
    const username = core.getInput('username');
    const token = core.getInput('token');
    const cpUrl = core.getInput('cp-url');
    const facetsctlLoginCommand = `node ${facetsctlBinary} login -u ${username} -t ${token} -c ${cpUrl}`;
    await executeCommand(facetsctlLoginCommand);

    // Register command inputs
    const dockerImage = core.getInput('docker-image');
    const service = core.getInput('service');
    const externalId = core.getInput('external-id');
    const autodetectGitRef = core.getInput('autodetect-git-ref') === 'true';
    let gitRef = core.getInput('git-ref');

    if (autodetectGitRef && !gitRef) {
      gitRef = await getCurrentGitRef();
    }

    const description = core.getInput('description') || '';
    const registry = core.getInput('registry') || '';
    const blueprintName = core.getInput('blueprint-name') || '';
    const debug = core.getInput('debug') || 'false';
    const registrationType = core.getInput('registration-type');

    if (!dockerImage || !service || !externalId || !gitRef) {
      throw new Error('Required inputs are missing.');
    }

    // Construct the register command
    let registerCommand = `node ${facetsctlBinary} register -i ${dockerImage} -s ${service} -e ${externalId} --git-ref ${gitRef}`;
    
    if (description) registerCommand += ` -d "${description}"`;
    if (registry) registerCommand += ` --registry ${registry}`;
    if (blueprintName) registerCommand += ` --blueprint-name ${blueprintName}`;
    if (debug !== 'false') registerCommand += ` --debug ${debug}`;
    if (registrationType) registerCommand += ` --registration-type ${registrationType}`;

    // Execute the register command
    await executeCommand(registerCommand);

    console.log('Image registered successfully.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

async function getCurrentGitRef() {
  const gitRefCommand = 'git rev-parse --abbrev-ref HEAD || git describe --tags';
  return new Promise((resolve, reject) => {
    exec(gitRefCommand, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout));
      } else {
        resolve(stdout);
      }
    });
  });
}

run();
