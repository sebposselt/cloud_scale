const express = require('express');
const router = express.Router();

const qldTraffic = require('../qldTraffic');
const objdetection = require('../lib/ObjDetection');
const db = require("../lib/DB");

webcamList = ["1", "4", "5",];


/* GET home page. */
router.get('/', function (req, res, next) {
    qldTraffic.QLDtrafficAPIRequest().then( async function whenOk(allTrafficData) {
        const cams = qldTraffic.cleanList(allTrafficData); 
        let webcamData = qldTraffic.filterTrafficData(webcamList, allTrafficData);
        //loop through list, extract all url and IDs, run detection.
        let detectCarPromises = webcamData.map(x => {
            return objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
        });
        detectCarsArr = await Promise.all( detectCarPromises);

        db.bulkUpload(detectCarsArr);
        res.render('index', { 
            title: 'Express',
            cams: cams
        });
    }).catch((error) => {
        console.log(error);

    });
});

module.exports = router;
