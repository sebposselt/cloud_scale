var express = require('express');
var router = express.Router();

var datamanager = require('../datamanager');


var webCamlist = ["1", "3", "117"];
var promises = [];



/* GET home page. */
router.get('/', function(req, res, next) {


  //should probably be a post route. Where the webcam ids comes from the user.

  for (let i = 0; i < webCamlist.length; i++) {
    console.log(webCamlist[i]);
    promises.push(datamanager.QLDtrafficAPIRequest(webCamlist[i]));
  }


  Promise.all(promises).then(function whenOk(response) {
      datamanager.extractImages(response);

      res.render('index', { title: 'Express' });
  }).catch((error) => {
      console.log("promise failed");
  });


});

module.exports = router;
