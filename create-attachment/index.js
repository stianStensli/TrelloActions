const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

function sleep(seconds)  {
    var e = new Date().getTime() + (seconds * 2000);
    while (new Date().getTime() <= e) {}
}

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    const cardId = core.getInput('cardId');
    
    const url = github.context.payload.head_commit.message.url;
    if(cardId !== undefined){
        console.log(`Using url as attachment: ${url}`)
        console.log(`Adding attachment to trello card: ${cardId}`)

        const run = async () => {
            fetch(`https://api.trello.com/1/cards/${cardId}}/attachments?url=https://github.com/stianStensli/GithubAtionsTest&key=${key}&token=${token}`, { method: 'POST'})
                .then(res => console.log(res))
                .then(console.log("Upload complete..."))
        };
        run();
        sleep(1)
    }else{
        console.log("This action is ignored, as no card-id is given...")
    }
} catch (error) {
    core.setFailed(error.message);
}
