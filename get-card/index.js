const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const trelloCardPattern = /^T-(\d+)/;

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    
    const time = (new Date()).toTimeString();
    var match = github.context.payload.head_commit.message.match(trelloCardPattern);
    if(match === null){
        core.setOutput("");
    }else{
    const requestedCardShortId = match[1]
    

    const allCards = await fetch(`https://api.trello.com/1/boards/5ef097c91bc451362bac9ac4/cards?fields=name,url,idShort&key=${key}&token=${token}`, { method: 'GET'})
    .then(res => res.json());
    
    const requestedCard = allCards.find(v => v.idShort == requestedCardShortId)
    console.log(`The card: ${requestedCard}`)

    core.setOutput(requestedCard.id);
    }
} catch (error) {
    core.setFailed(error.message);
}