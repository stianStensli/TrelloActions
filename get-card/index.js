const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const trelloCardPattern = /^T-(\d+)/;

function sleep(seconds)  {
    var e = new Date().getTime() + (seconds * 2000);
    while (new Date().getTime() <= e) {}
}

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    
    const time = (new Date()).toTimeString();
    var match = github.context.payload.head_commit.message.match(trelloCardPattern);
    if(match === null){
        core.setOutput("");
    }else{
        const requestedCardShortId = match[1]
        console.log(`Requested short ID: ${requestedCardShortId}`)

        const run = async () => {
            fetch(`https://api.trello.com/1/boards/5ef097c91bc451362bac9ac4/cards?fields=name,url,idShort&key=${key}&token=${token}`, { method: 'GET'})
                .then(res => res.json())
                .then(json => {
                    const requestedCard = json.find(v => v.idShort == requestedCardShortId)
                    console.log(`The card: ${requestedCard.id}`)
                    core.setOutput(requestedCard.id);

                })
        };
        core.setOutput("1");
        core.setOutput("2");
        run();
        sleep(1)
    }
} catch (error) {
    core.setFailed(error.message);
}