const express = require('express');
const router = express.Router();
var unirest = require('unirest');
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
    }).catch((error) => {
        console.log(error);

    });
});



router.post('/car-detection', function(req, res){
    let sessData = {
        "client_id" : req.session.id,
        "cams" : req.body.camID
    };
    //send msg to data-manager
    HTTPpost(sessData);

    //get pictures from database

    res.render('car-detection', {
        title: 'Detect Cars in WebCams',
        cams: sessData.cams
    });
});

const HTTPpost = function (data) {
    var req = unirest("POST", datamanagerAddress);
    req.headers({
        "content-type": "application/json"
    });
    req.type("json");
    req.send(data);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        // console.log(res.body);

    });
}


module.exports = router;
