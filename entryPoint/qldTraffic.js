var unirest = require('unirest');
let apikey = "3e83add325cbb69ac4d8e5bf433d770b";


let APIinfo = {
    "hostname" : "https://api.qldtraffic.qld.gov.au/",
    "path" : "v1/webcams/",
    "APIkey": "?apikey=" + apikey
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
        res.push(tmp);
        // res.push(elm.properties.description);
    }
    return res;
};


