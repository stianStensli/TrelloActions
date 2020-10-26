const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const trelloCardPattern = /^[F|f][O|o]-(\d+)/;

function sleep(seconds)  {
    var e = new Date().getTime() + (seconds * 2000);
    while (new Date().getTime() <= e) {}
}

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    const board = core.getInput('board');
    
    var match = github.context.payload.head_commit.message.match(trelloCardPattern);
    if(match !== null) {
        const requestedCardShortId = match[1]
        console.log(`Requested short ID: ${requestedCardShortId}`)

        const run = async () => {
            fetch(`https://api.trello.com/1/boards/${board}/cards?fields=name,url,idShort&key=${key}&token=${token}`, { method: 'GET'})
                .then(res => res.json())
                .then(json => {
                    const requestedCard = json.find(v => v.idShort == requestedCardShortId)
                    console.log(`The card: ${requestedCard.id}`)
                    core.setOutput("card-id", requestedCard.id);
                })
        };
        run();
        sleep(1.5); // TODO: find better method of witing for respons
    }
} catch (error) {
    core.setFailed(error.message);
}
