const express = require('express');
const router = express.Router();

const utils = require('../lib/utils');
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
        "id" : req.session.id,
        "cams" : req.body.camID
    };


    //send msg to data-manager
    utils.HTTPrequest(sessData);



    //get pictures from database


    res.render('car-detection', {
        title: 'Detect Cars in WebCams',
        cams: sessData.cams
    });

});

module.exports = router;
