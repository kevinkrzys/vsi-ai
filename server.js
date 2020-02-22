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
});

app.get('/generateNLG', (req, res) => {
    let block = getBlock(req.query.block);
    let data = JSON.parse(req.query.data);
    let response = rosaenlgPug.renderFile(block, {
        language: 'en_US',
        data: data
    })
    console.log(req.query.block);
    res.send(response);
});

getBlock = function (block) {
    switch (block) {
        case "Introduction":
            return "introduction.pug";

        case "Enterprise Summary":
            return "enterprise-summary.pug";

        case "Storage by DC":
            return "storage-by-dc.pug";

        case "Trends - Capacity":
            return "capacity.pug";

        case "Trends - Performance":
            return "performance.pug";

        case "Host Summary":
            return "host-summary.pug";

        case "Pool Alerts":
            return "pool-alerts.pug";

        case "Provisioning Summary":
            return "pro-summary.pug";

        case "VMware Summary":
            return "vmsummary.pug";

        case "Conclusion":
            return "conclusion.pug";

        case "Signature":
            return "signature.pug";
    }
}