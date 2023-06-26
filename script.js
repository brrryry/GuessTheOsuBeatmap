const fs = require('fs')
const jsonfile = require('jsonfile');

async function refreshToken() {
    let fileData = jsonfile.readFileSync('./secrets.json');
    let clientID = fileData["client_id"];
    let clientSecret = fileData["client_secret"];
    let refreshToken = fileData["refresh_token"];

    console.log(refreshToken);

    
    response = await fetch(`https://osu.ppy.sh/oauth/token/?client_id=${clientID}&client_secret=${clientSecret}&grant_type=refresh_token&refresh_token=${refreshToken}&scope=public+identify`, {
        method: "POST",
        headers: {
            "Accept:": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }).then((data) => console.log(data))

    
}

refreshToken()
