const express = require('express');
const unirest = require("unirest");
const router = express.Router();

const lbAddress = require('../LB_IP'); //loadbalancer ip
//const qldTraffic = require('../qldTraffic');


/// SUMMERY : The datamanager was planned to have more responsibility, but has been simplified to just forwarding data from the frontend
/// INPUT	: 
/// OUTPUT	: 
/// ERROR	: 
router.post('/cams', (req, res, next) => {
    let statusCode = 200;
    console.log("recieved msg");
    // qldTraffic.addCameras(req.body);
    
    statusCode = HTTPpost(req.body);
    res.sendStatus(statusCode);
    res.end();
});



/// SUMMERY : Helper function to send data between servers.
/// INPUT	: the data you want to send
/// OUTPUT	: 200 or 500 depending on if it went well. The output is to be used as StatusCodes.
/// ERROR	: return 500 in case of error, 
/// Notes   : 
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
