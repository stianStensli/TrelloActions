import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import fetch from 'node-fetch';

try {
    const key = getInput('key');
    const token = getInput('token');
    const cardId = getInput('card-id');
    const type = getInput('attachment-type');
    
    var url;
    if(type == "branch" ){
        const branch   = context.payload.ref.replace("refs/heads/","");  // refs/heads/****
        const org_repo = context.payload.full_name;                      // org/repo
        url = `https://github.com/${org_repo}/tree/${branch}`;           // https://github.com/org/repo/tree/branch
    } else {
        url = context.payload.head_commit.url;
    }

    if(cardId !== undefined || cardId !== null || cardId !== "" ){
        console.log(`Using attachment type: ${type}`)
        console.log(`Using url as attachment: ${url}`)
        console.log(`Adding attachment to trello card: ${cardId}`)

        const run = async () => {
            fetch(`https://api.trello.com/1/cards/${cardId}/attachments?url=${url}&key=${key}&token=${token}`, 
                { 
                    method: 'POST', 
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(res => console.log(res))
                .then(console.log("Upload complete..."))
        };
        run();
    }else{
        console.log("This action is ignored, as no card-id is provided...")
    }
} catch (error) {
    setFailed(error.message);
}
