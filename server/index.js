const express = require('express');
const jsonfile = require('jsonfile');
const sql = require('sqlite3').verbose();
const db = new sql.Database('./beatmaps.sqlite');
const bodyParser = require('body-parser');
const unzip = require ('unzip-stream');
const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');

let fileData = jsonfile.readFileSync('./secrets.json');
let clientID = fileData["client_id"];
let clientSecret = fileData["client_secret"];
let accessToken = fileData["access_token"];
let refreshToken = fileData["refresh_token"];

const PORT = process.env.PORT || 3001;

const app = express();
var jsonParser = bodyParser.json();
var urlEncodedParser = bodyParser.urlencoded({extended: false})

app.get("/api", (req, res) => {
    res.json({message: "Hello!"});
});

app.post("/beatmaps/add", urlEncodedParser, async function(req, res) {
    if(!req.body || !req.body.id) {
        res.status(400);
        res.json({error: "Bad Request: Missing ID"})
    } else {
        let output = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/${req.body.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        }).then(response => response.json()).then(async data => {
            if(!data["artist"]) {
                res.status(404);
                res.json({error: "Beatmap ID does not exist."});
            } else {
                var mem = await axios.get(`http://api.chimu.moe/v1/download/${req.body.id}?n=1`, {responseType: 'arraybuffer'});
                var zip = new AdmZip(mem.data);
                var zipEntries = zip.getEntries();
                var foundBeatmap = false;

                for (var i = 0; i < zipEntries.length; i++) {
                    if(zipEntries[i].name.includes(".png") || zipEntries[i].name.includes(".jpg")) {
                        await zip.extractEntryTo(zipEntries[i], "./beatmaps/", true, true, `${req.body.id} (${i}).png`);
                        fs.rename(`./beatmaps/${zipEntries[i].name}`, `./beatmaps/${req.body.id}.png`, err => {if(err) console.log(err);});
                        res.status(200);
                        res.json({response: "Successful Beatmap Image Addition! Thanks :D"})
                        foundBeatmap = true;
                    }
                }

                if(!foundBeatmap) res.json({response: "Couldn't find image..."})
            }
        })
    }



})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
})