// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
//
// NONE OF THIS IS USED AS THE DATAMANAGER'S RESPONSIBILITY HAS BEEN CHANGED FROM ITS ORIGINAL INTEND
//
// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************
// ****************************************************************************************



const apikey = "3e83add325cbb69ac4d8e5bf433d770b";
//contains a list of webcamID that the users have requested
let webcamList = [];


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