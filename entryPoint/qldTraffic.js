const unirest = require('unirest');
const apikey = "3e83add325cbb69ac4d8e5bf433d770b";


const APIinfo = {
    "hostname" : "https://api.qldtraffic.qld.gov.au/",
    "path" : "v1/webcams/",
    "APIkey": "?apikey=" + apikey
};


/// SUMMERY : call the API
/// INPUT	: 
/// OUTPUT	: returns a promise of the api response.
/// ERROR	: 
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



/// SUMMERY : strips a "webcam object" from the API response for the needed properties
/// INPUT	: 
/// OUTPUT	: 
/// ERROR	: 
exports.extractImageURLAndID = function(webcamData){
    let webcamImage = {
        "id" : webcamData.properties.id,
        "url" : webcamData.properties.image_url
    };
    return webcamImage;
};



/// SUMMERY : used to strip the API response object into an array of {id,description}. 
///           It is used to produce the list of webcams to choose from in the frontend 
/// INPUT	: The api response object
/// OUTPUT	: [{id,description}]
/// ERROR	: 
exports.cleanList = function(allTrafficData){
    let res = [];
    for (let i = 0; i < allTrafficData.features.length; i++) {
        const elm = allTrafficData.features[i];
        let tmp = {"id": elm.properties.id, "description":elm.properties.description};
        res.push(tmp);
    }
    return res;
};


