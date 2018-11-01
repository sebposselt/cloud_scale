const express = require('express');
const unirest = require("unirest");
const router = express.Router();

const lbAddress = require('../LB_IP');
const qldTraffic = require('../qldTraffic');

router.post('/cams', (req, res, next) => {
    let statusCode = 200;
    console.log("Recieved msg");
    qldTraffic.addCameras(req.body);
    
    statusCode = HTTPpost(req.body);
    res.sendStatus(statusCode);
    res.end();
});
//message format
//{"id":"lJ4CqJ_25Py9XFws-MetYGjYcfnWYK3N","cams":["164","166","167"]}
HTTPpost = function (data) {
    let statusCode = 200;
    var req = unirest("POST", lbAddress.ip);
    req.headers({
        "content-type": "application/json"
    });
    req.type("json");
    try {
        req.send(data);
        req.end(function (res) {
            if (res.error) {
                console.log(res.error);
                statusCode = 500;
            }
        });
    }
    catch (error) {
        statusCode = 500;
        console.log('HTTPpost ERROR: ', error);
    }
    finally {
        return statusCode;
    }
}



module.exports = router;
