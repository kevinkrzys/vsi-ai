const rosaenlgPug = require('rosaenlg');
const express = require('express')
const app = express();

const port = 4300;

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`)
})

let phones = [
    {
        name: 'OnePlus 5T',
        colors: ['Black', 'Red', 'White'],
        displaySize: 6,
        screenRatio: 80.43,
        battery: 3300,
    },
    {
        name: 'OnePlus 5',
        colors: ['Gold', 'Gray'],
        displaySize: 5.5,
        screenRatio: 72.93,
        battery: 3300,
    },
    {
        name: 'OnePlus 3T',
        colors: ['Black', 'Gold', 'Gray'],
        displaySize: 5.5,
        screenRatio: 73.15,
        battery: 3400,
    },
];

app.get('/generate', (req, res) => {
    let generatedText = rosaenlgPug.renderFile('tuto.pug', {
        language: 'en_US',
        phone: phones[0]
    });
    res.send(generatedText);
})