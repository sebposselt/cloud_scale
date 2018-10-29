const express = require('express');
const router = express.Router();
const assert = require('assert');


const qldTraffic = require('../qldTraffic');
const objdetection = require('../lib/ObjDetection');
const db = require("../lib/DB");


// /* GET home page. */
// router.get('/', function (req, res, next) {
//     qldTraffic.QLDtrafficAPIRequest().then( async function whenOk(allTrafficData) {
//         const cams = qldTraffic.cleanList(allTrafficData);
//         let webcamData = qldTraffic.filterTrafficData(webcamList, allTrafficData);
//         //loop through list, extract all url and IDs, run detection.
//         let detectCarPromises = webcamData.map(x => {
//             return objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
//         });
//         detectCarsArr = await Promise.all( detectCarPromises);
//         db.bulkUpload(detectCarsArr);
//         res.render('index', { 
//             title: 'Express',
//             cams: cams
//         });
//     }).catch((error) => {
//         console.log(error);

//     });
// });



//parses the post body. VERY IMPORTANT. body must be:
// {
//     client_id: string,
//     cams: []string
// }

router.post('/', async function (req, res, next) {
    if (req.body["client_id"] == null) {
        console.log('SERVER.JS BODY IN POST NOT CORRECT FORM');
        res.end();        
    }

    if ((req.body["cams"] == null)) {
        if ((req.body["cams"]).length != 0){
            for (let i = 0; i < (req.body.cams).length; i++) {
                const elm = (req.body.cams)[i];
                // TODO check every element is string!!
                //else res.end();
                
                

            }
        }
        console.log('SERVER.JS body.cams IN POST NOT CORRECT FORM');
        res.end();
    }

    const clientID = req.body.client_id;
    const cam_lst = req.body.cams;

    console.log("Client id: ",clientID);
    console.log("Post baby post!");
    qldTraffic.QLDtrafficAPIRequest().then(async function whenOk(allTrafficData) {
        let webcamData = qldTraffic.filterTrafficData(cam_lst, allTrafficData);
        //loop through list, extract all url and IDs, run detection.
        let detectCarPromises = webcamData.map(x => {
            return objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
        });
        console.log('detection done!');
        
        detectCarsArr = await Promise.all(detectCarPromises);
        console.log('awaited');
        
        db.bulkUpload(detectCarsArr);
        res.end()
    }).catch((error) => {
        console.log(error);
    });
});



module.exports = router;
