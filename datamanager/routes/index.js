const express = require('express');
const unirest = require("unirest");
const router = express.Router();

const lbAddress = require('../LB_IP');
const qldTraffic = require('../qldTraffic');

router.post('/cams', (req, res, next) => {
    console.log("Recieved msg");
    qldTraffic.addCameras(req.body);
    res.sendStatus(200);
    console.log("status send!")
    console.log("body: ",req.body);
    HTTPpost(req.body);
    console.log('shit was send');
    res.end();
    console.log('end');



});
//message format
//{"id":"lJ4CqJ_25Py9XFws-MetYGjYcfnWYK3N","cams":["164","166","167"]}

HTTPpost = function (data) {
    console.log('we are in');
    
    var req = unirest("POST", lbAddress.ip);
    req.headers({
        "content-type": "application/json"
    });
    req.type("json");

    req.send(data);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
    });
}


module.exports = router;
