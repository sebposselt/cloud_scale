const express = require('express');
const router = express.Router();

const qldTraffic = require('../qldTraffic');
const objdetection = require('../lib/ObjDetection');
const db = require("../lib/DB");




//parses the post body. VERY IMPORTANT. body must be:
// {
//     client_id: string,
//     cams: []string
// }
router.post('/', async function (req, res, next) {
    let returnCode = 200;
    if (req.body["client_id"] == null) {
        console.log('SERVER.JS BODY IN POST NOT CORRECT FORM');
        res.end();
    }
    if ((req.body["cams"] == null)) {
        res.sendStatus(400);
        res.end();
    }
    if ((req.body["cams"]).length == 0) {
        res.sendStatus(400);
        res.end();
    }
    const clientID = req.body.client_id;
    const cam_lst = req.body.cams;

    console.log("Client id: ", clientID);
    console.log("Post baby post!");

    qldTraffic.QLDtrafficAPIRequest().then(async function whenOk(allTrafficData) {
        let webcamData = qldTraffic.filterTrafficData(cam_lst, allTrafficData);
        //loop through list, extract all url and IDs, run detection.
        let detectCarPromises = webcamData.map(x => {
            return objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
            // returnCode = result[0];
            // return result[1];
        });

        // if (returnCode != 200){
        //     console.log('api or detection error... :( ');
        //     res.sendStatus(returnCode);
        //     res.end();
        //     return;
        // }
        let carsDetected = [];
        try {
            let detectCarsArr = await Promise.all(detectCarPromises);
            for (let i = 0; i < detectCarsArr.length; i++) {
                const elm = detectCarsArr[i];
                const code = elm[0];
                const car = elm[1];
                if (code == 200){
                    carsDetected.push(car);
                }                
            }
            console.log('detection done!');
        } catch (error){
            res.sendStatus(500);
            res.end();
            return;
        }

        try {
            // bulkUpload returns 200 if all goes well, 500 otherwise.
            let result = db.bulkUpload(carsDetected);
            console.log("DB upload resultCode: ",result);
            res.sendStatus(result);
            res.end();
        } catch (error) {
            console.log("big fuckup... ", error);
            res.sendStatus(500);
            res.end();
            return;
        }
    }).catch((error) => {
        console.log(error);
    });
});
module.exports = router;
