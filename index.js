const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https')
const fc_oauth = 'https://customerapiauth.fortinet.com/api/v1/oauth/token/'
const flex_url = 'https://support.fortinet.com'


function retrieveToken(flexVmAppId, flexVmPassword) {

  const data = JSON.stringify({
    username: flexVmAppId,
    password: flexVmPassword,
    client_id: 'flexvm',
    grant_type: 'password'
  })
  
  const options = {
    hostname: 'customerapiauth.fortinet.com',
    port: 443,
    path: '/api/v1/oauth/token/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  }
  
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      response = JSON.parse(d)
      return response.access_token
    })
  })
  
  req.on('error', error => {
    throw("Unable to connect to FortiCare to retrieve token: " + error)
  })
  
  req.write(data)
  req.end()
}

function retrieveProgram(bearer) {

  const options = {
    hostname: 'support.fortinet.com',
    port: 443,
    path: '/ES/api/flexvm/v1/programs/list',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': 'Bearer ' + bearer
    }
  }
  
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      response = JSON.parse(d)
      return response.programs[0].serialNumber
    })
  })
  
  req.on('error', error => {
    throw("Unable to connect to portal to retrieve program id: " + error)
  })
  
  req.write(data)
  req.end()
}

try {
  // `who-to-greet` input defined in action metadata file
  const flexVmAppId = core.getInput('flexvm_app_id');
  const flexVmPassword = core.getInput('flexvm_password');
  const flexVmConfigName = core.getInput('flexvm_config_name');

  token = retrieveToken(flexVmAppId, flexVmPassword);
  program = retrieveProgram(token);
  const time = (new Date()).toTimeString();

  core.setOutput("flexvm_token", token.substring(1,5));
  core.setOutput("flexvm_serial_number", program);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
