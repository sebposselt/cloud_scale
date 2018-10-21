var express = require('express');
var router = express.Router();

var qldTraffic = require('../qldTraffic');


webamList = ["1", "3", "117"];



/* GET home page. */
router.get('/', function(req, res, next) {
    qldTraffic.QLDtrafficAPIRequest().then(function whenOk(allTrafficData) {

        let webcamData = qldTraffic.filterTrafficData(webamList,allTrafficData);

        //loop through list to extract all urls
        qldTraffic.extractImageURL(webcamData[0]);

        res.render('index', { title: 'Express' });
    }).catch((error) => {
        console.log(error);

  });
});

module.exports = router;
