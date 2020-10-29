const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

async function apiCall(cardId, key, token, url)  {
}

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    const board = core.getInput('board');
} catch (error) {
    core.setFailed(error.message);
}
