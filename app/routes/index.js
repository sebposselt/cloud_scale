var express = require('express');
var router = express.Router();

var qldTraffic = require('../qldTraffic');


var webCamlist = ["1", "3", "117"];



/* GET home page. */
router.get('/', function(req, res, next) {
    qldTraffic.QLDtrafficAPIRequest().then(function whenOk(allTrafficData) {
        let webcamData = qldTraffic.filterTrafficData(webCamlist,allTrafficData);
        qldTraffic.extractImageURL(webcamData);
        res.render('index', { title: 'Express' });
    }).catch((error) => {
        console.log(error);

  });
});

module.exports = router;
