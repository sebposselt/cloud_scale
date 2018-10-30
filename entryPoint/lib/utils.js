
//test http post
//http://httpdump.io/nzsjx/dumpyard


var unirest = require("unirest");



exports.HTTPrequest = function(data){

    var req = unirest("POST", "https://httpdump.io/nzsjx");
    req.headers({
        "content-type": "application/json"
    });
    req.type("json");
    req.send(data);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);

        console.log(res.body);
        console.log(res.body);
    });

}