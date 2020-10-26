const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    const cardId = core.getInput('card-id');
    const type = core.getInput('attachment-type');
    
    var url;
    if(type == "branch" ){
        const branch   = github.context.payload.ref.replace("refs/heads/","");
        const org_repo = github.context.payload.repository.full_name;
        url = `https://github.com/${org_repo}/tree/${branch}`;
    } else {
        url = github.context.payload.head_commit.url;
    }

    if(cardId !== undefined && cardId !== null && cardId !== "") {
        console.log(`Using attachment type: ${type}`)
        console.log(`Using url as attachment: ${url}`)
        console.log(`Adding attachment to trello card: ${cardId}`)

        const run = async () => {
            fetch(`https://api.trello.com/1/cards/${cardId}/attachments?key=${key}&token=${token}`, 
            { 
                method: 'GET', 
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then(attachments => {
                console.log(`Current number of attachments: ${attachments.length}`)
                if(!attachments.find(v => v.url == url)){
                    fetch(`https://api.trello.com/1/cards/${cardId}/attachments?url=${url}&key=${key}&token=${token}`, 
                        { 
                            method: 'POST', 
                            headers: {
                                'Accept': 'application/json'
                            }
                        })
                        .then(res => console.log(res))
                        .then(console.log("Upload complete..."))
                        .catch(error => console.log(error));
                }else{
                    console.log("Adding attachment was canceled to prevent duplicate attachment.")
                }
            }).catch(error => console.log(error));
        };
        run();
    }else{
        console.log("This action is ignored, as no card-id is provided...")
    }
} catch (error) {
    core.setFailed(error.message);
}
