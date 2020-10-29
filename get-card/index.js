const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const trelloCardPattern = /^[T|t][C|c]-(\d+)/;

async function apiCall(board, key, token, requestedCardShortId)  {
    return fetch(`https://api.trello.com/1/boards/${board}/cards?fields=name,url,idShort&key=${key}&token=${token}`, { method: 'GET'})
        .then(res => res.json())
        .then(json => {
            const requestedCard = json.find(v => v.idShort == requestedCardShortId)
            console.log(`The card: ${requestedCard.id}`)

            core.setOutput("success", true)
            core.setOutput("card-id", requestedCard.id);
        })
        .catch(err => {
            console.error(err);
            core.setFailed(error.message);
        });
}

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    const board = core.getInput('board');
    
    var match = github.context.payload.head_commit.message.match(trelloCardPattern);
    if(match !== null) {
        const requestedCardShortId = match[1]
        console.log(`Requested short ID: ${requestedCardShortId}`)

        core.group('Fetching card id', async () => {
            await apiCall(board, key, token, requestedCardShortId);
          });

    }else{
        console.log("Commit message for Trello link must start with TC-<num>")
    }
} catch (error) {
    core.setFailed(error.message);
}
