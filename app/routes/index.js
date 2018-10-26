const express = require('express');
const router = express.Router();

const qldTraffic = require('../qldTraffic');
const objdetection = require('../lib/ObjDetection');


webcamList = ["1", "4", "5",];


/* GET home page. */
router.get('/', function (req, res, next) {

    //test-code
    if(req.session.page_views){
        req.session.page_views++;
        console.log("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        console.log("Welcome to this page for the first time!");
    }


    //må legge til at dette legges til når vi får en POST.
    var sessData = req.session;
    sessData.cams = webcamList;
    sessData.id = req.session.id;
    console.log("Session ID")
    console.log(req.session.id);




    qldTraffic.QLDtrafficAPIRequest().then(function whenOk(allTrafficData) {
        const cams = qldTraffic.cleanList(allTrafficData);
        console.log("cams: ");
        let webcamData = qldTraffic.filterTrafficData(webcamList, allTrafficData);
        //loop through list, extract all url and IDs, run detection.
        let tmp = []
        webcamData.map(x => {
            var img = objdetection.runDetect(qldTraffic.extractImageURLAndID(x), 0.1);
            tmp.push(img);
        });



        res.render('index', { 
            title: 'Express',
            cams: cams
        });
    }).catch((error) => {
        console.log(error);

    });
});

module.exports = router;
