const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

async function apiCall(key, token, board, newList, cardId)  {
fetch(`https://api.trello.com/1/boards/${board}/lists?key=${key}&token=${token}`, 
    { 
        method: 'GET', 
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(lists => {
        console.log(`Current number of lists: ${lists.length}`);
        const newListId = lists.find(v => v.name == newList);

        if(!newListId){
            console.log(`Did not find list with the name: ${newListId}`)
        }else{
            fetch(`https://api.trello.com/1/cards/${cardId}/attachments?idList=${newListId}&key=${key}&token=${token}`, 
            { 
                method: 'PUT', 
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                console.log(
                  `Response: ${response.status} ${response.statusText}`
                );
                return response.text();
              })
              .then(text => console.log(text))
              .catch(err => console.error(err));
        }

    }).catch(error => console.log(error));
}
try {
    const key = core.getInput('key');
    const token = core.getInput('token');
    const board = core.getInput('board');
    const newList = core.getInput('to-list');
    const cardId = core.getInput('card-id');

    console.log(`Moving card to list: ${newList}`)
    console.log(`On board: ${board}`)
    console.log(`With card: ${cardId}`)
    core.group('Fetching card id', async () => {
        await apiCall(key, token, board, newList, cardId);
    });

} catch (error) {
    core.setFailed(error.message);
}
