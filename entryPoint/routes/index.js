const express = require('express');
const router = express.Router();
const unirest = require('unirest');

const datamanagerAddress = "http://localhost:8080/cams"
const qldTraffic = require('../qldTraffic');



/* GET home page. */
router.get('/', function (req, res, next) {
    qldTraffic.QLDtrafficAPIRequest().then(function whenOk(allTrafficData) {
        const cams = qldTraffic.cleanList(allTrafficData);
        res.render('index', {
            title: 'Express',
            cams: cams
        });
        res.end();
    }).catch((error) => {
        console.log(error);
        res.end();
    });
});


router.post('/car-detection', function (req, res) {
    let sessData = {
        "client_id": req.session.id,
        "cams": req.body.camID
    };
    //send msg to data-manager
    // statusCode is not used, but HTTPpost is a copied helper function used other places where the return value is used.
    let statusCode = HTTPpost(sessData); 

    //get pictures from database
    // res.sendStatus(statusCode);
    res.render('car-detection', {
        title: 'Detect Cars in WebCams',
        cams: sessData.cams
    });
    // res.sendStatus(statusCode);
    res.end();
});



/// SUMMERY : Helper function to send data between servers.
/// INPUT	: the data you want to send
/// OUTPUT	: 200 or 500 depending on if it went well. The output is to be used as StatusCodes.
/// ERROR	: return 500 in case of error, 
/// Notes   : 
const HTTPpost = function (data) {
    let statusCode = 200;
    let req = unirest("POST", datamanagerAddress);
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
        return statusCode;
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
