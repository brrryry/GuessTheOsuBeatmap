const fs = require('fs')
const jsonfile = require('jsonfile');

async function postRequest(url, body) {
    response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: new URLSearchParams(body)
      });

    return response.json();
}

async function refreshToken() {
    let fileData = jsonfile.readFileSync('./secrets.json');
    let clientID = fileData["client_id"];
    let clientSecret = fileData["client_secret"];
    let accessToken = fileData["access_token"];
    let refreshToken = fileData["refresh_token"];


    
    response = await postRequest("https://osu.ppy.sh/oauth/token", {
          'client_id': clientID,
          'client_secret': clientSecret,
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken,
          'scope': 'public identify'
    })

    console.log(response)
    if(response["error"]) {
        return;
    }

    accessToken = response["access_token"];
    refreshToken = response["refresh_token"];

    newData = {
        "client_id": clientID,
        "client_secret": clientSecret,
        "access_token": accessToken,
        "refresh_token": refreshToken
    };

    jsonfile.writeFileSync("./secrets.json", newData);
    console.log("Token Refreshed Successfully.");
}

refreshToken();


