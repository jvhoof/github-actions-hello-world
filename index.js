const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const flexVmAppId = core.getInput('FLEXVM_APP_ID');
  const flexVmPassword = core.getInput('FLEXVM_PASSWORD');
  console.log(`Hello ${flexVmAppId}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("flexvm_token", time);
  core.setOutput("flexvm_license", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
