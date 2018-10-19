var unirest = require('unirest');
apikey = "3e83add325cbb69ac4d8e5bf433d770b";

let APIinfo = {
    "hostname" : "https://api.qldtraffic.qld.gov.au/",
    "path" : "v1/webcams/",
    "webCamID": "1",
    "APIkey": "?apikey=" + apikey
};



exports.QLDtrafficAPIRequest = function(webCamID)  {
    APIinfo.webCamID = webCamID;
    return new Promise(function(resolve, reject) {
        unirest.get(APIinfo.hostname + APIinfo.path + APIinfo.webCamID + APIinfo.APIkey)
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

exports.extractImages = function(response){
    //store the data???
    
    for (let i = 0; i < response.length; i++) {
        console.log(response[i].features[0].properties.id);
        console.log(response[i].features[0].properties.image_url);
        console.log("****************************************************");
    }
};



