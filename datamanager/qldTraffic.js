var unirest = require('unirest');
let apikey = "3e83add325cbb69ac4d8e5bf433d770b";


//contains a list of webcamID that the user has requested
let webcamList = [];


let APIinfo = {
    "hostname" : "https://api.qldtraffic.qld.gov.au/",
    "path" : "v1/webcams/",
    "APIkey": "?apikey=" + apikey
};


exports.addCameras = function(reqBody){
    webcamList.push(reqBody);
    console.log("Added cameras");
    console.log(webcamList);
};



exports.removeCamera = function(webcamID){
    var index = webcamList.indexOf(webcamID);
    if (index > -1) {
        webcamList.splice(index, 1);
        console.log("Removed camera " + webcamID);
    }
};


exports.QLDtrafficAPIRequest = function()  {
    return new Promise(function(resolve, reject) {
        unirest.get(APIinfo.hostname + APIinfo.path + APIinfo.APIkey)
            .header("X-Mashape-Key", "JCOm6HzntkmshkTLOE6Omng73CKap1Xh0cdjsnhhOk5IdC253g")
            .header("Accept", "text/plain")
            .end(function (result) {
                if (result.error) {
                    console.log("Call to API failed")
                    reject(result.error);
                } else {
                    console.log("Call to API succeded");
                    resolve(result.body);
                }
            });
    })
};


//filters out the cameras the user has requested
//må kunne slå op på client

exports.filterTrafficData = function (allTrafficData, sessID){
    let webcamData = [];
    for (let i = 0; i < allTrafficData.features.length; i++) {
        if (webcamList.includes(String(allTrafficData.features[i].properties.id))){
            console.log("Webcam    " + allTrafficData.features[i].properties.id);
            webcamData.push(allTrafficData.features[i]);
        }
    }
    return webcamData;
};




exports.extractImageURLAndID = function(webcamData){
    let webcamImage = {
        "id" : webcamData.properties.id,
        "url" : webcamData.properties.image_url
    };
    return webcamImage;
};


exports.cleanList = function(allTrafficData){
    let res = [];
    for (let i = 0; i < allTrafficData.features.length; i++) {
        const elm = allTrafficData.features[i];
        let tmp = {"id": elm.properties.id, "description":elm.properties.description};
        //console.log(tmp, elm.properties.description)
        res.push(tmp);
        // res.push(elm.properties.description);
    }
    return res;
};