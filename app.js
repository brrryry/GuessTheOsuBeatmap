const express = require('express');

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send("Wassup brother lol gonna be lit to do this project lmao");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

module.exports = app;