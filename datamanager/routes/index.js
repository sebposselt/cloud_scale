const express = require('express');
const router = express.Router();

const qldTraffic = require('../qldTraffic');




router.post('/cams', (req, res, next) => {
    console.log("Recieved msg");
    qldTraffic.addCameras(req.body);
    res.sendStatus(200);    
});
//message format
//{"id":"lJ4CqJ_25Py9XFws-MetYGjYcfnWYK3N","cams":["164","166","167"]}


module.exports = router;
