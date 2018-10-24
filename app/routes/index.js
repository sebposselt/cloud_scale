const express = require('express');
const router = express.Router();

const qldTraffic = require('../qldTraffic');
const objdetection = require('../lib/ObjDetection');


webcamList = ["1", "3", "80", "117"];


/* GET home page. */
router.get('/', function (req, res, next) {
    qldTraffic.QLDtrafficAPIRequest().then(function whenOk(allTrafficData) {
        // const cams = qldTraffic.clean(allTrafficData); got deleted....
        let webcamData = qldTraffic.filterTrafficData(webcamList, allTrafficData);
        //loop through list, extract all url and IDs, run detection.
        let tmp = []
        webcamData.map(x => {
            var img = objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
            tmp.push(img);
        });

        res.render('index', { title: 'Express' });
    }).catch((error) => {
        console.log(error);

    });
});

module.exports = router;
