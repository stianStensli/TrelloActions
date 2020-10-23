const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    
    const time = (new Date()).toTimeString();
    core.setOutput("At time: ", time);
    
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    const message = github.context.payload.head_commit.message
    
    fetch(`https://api.trello.com/1/boards/5ef097c91bc451362bac9ac4/cards?fields=name,url,idShort&key=${key}&token=${token}`, { method: 'POST', body: form })
    .then(res => res.json())
    .then(json => console.log(json));

    console.log(`The message: ${message}`)
} catch (error) {
    core.setFailed(error.message);
}