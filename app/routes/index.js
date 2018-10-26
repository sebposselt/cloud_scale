const express = require('express');
const router = express.Router();

const qldTraffic = require('../qldTraffic');
const objdetection = require('../lib/ObjDetection');



router.post('/cams', (req, res, next) => {
    console.log("Recieved msg");
    qldTraffic.addCameras(req.body);
    res.sendStatus(200);

    qldTraffic.QLDtrafficAPIRequest().then(function whenOk(allTrafficData) {
        let webcamData = qldTraffic.filterTrafficData(allTrafficData, sessID);

       // console.log(webcamData);
        //loop through list, extract all url and IDs, run detection.
        let tmp = []
       // webcamData.map(x = > {
         //   var img = objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
        //tmp.push(img);
        //});
        });
    });




    //message format
    //{"id":"lJ4CqJ_25Py9XFws-MetYGjYcfnWYK3N","cams":["164","166","167"]}


module.exports = router;
