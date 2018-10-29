const request = require('request-promise');
const { drawRect, } = require('./utils');
const utils = require('./utils');
const cv = require("opencv4nodejs");
const fs = require('fs');
const path = require('path');
const classNames = require('./dnnCocoClassNames');
const { extractResults } = require('./dnn/ssdUtils');
const db = require("./DB");



// code copied from https://github.com/justadudewhohacks/opencv4nodejs/tree/master/examples under MIT-licence
// **********************************************************************************************************
if (!cv.xmodules.dnn) {
  throw new Error('exiting: opencv4nodejs compiled without dnn module');
}

// replace with path where you unzipped inception model
const ssdcocoModelPath = path.join(__dirname, 'model', 'VGGNet', 'coco', 'SSD_300x300');

const prototxt = path.resolve(ssdcocoModelPath, 'deploy.prototxt');
const modelFile = path.resolve(ssdcocoModelPath, 'VGG_coco_SSD_300x300_iter_400000.caffemodel');

if (!fs.existsSync(prototxt) || !fs.existsSync(modelFile)) {
  console.log('could not find ssdcoco model');
  console.log('download the model from: https://drive.google.com/file/d/0BzKzrI_SkD1_dUY1Ml9GRTFpUWc/view');
  throw new Error('exiting: could not find ssdcoco model');
}

// initialize ssdcoco model from prototxt and modelFile
const net = cv.readNetFromCaffe(prototxt, modelFile);

function classifyImg(img) {
  // ssdcoco model works with 300 x 300 images
  const imgResized = img.resize(300, 300);

  // network accepts blobs as input
  const inputBlob = cv.blobFromImage(imgResized);
  net.setInput(inputBlob);

  // forward pass input through entire network, will return
  // classification result as 1x1xNxM Mat
  let outputBlob = net.forward();
  // extract NxM Mat
  outputBlob = outputBlob.flattenFloat(outputBlob.sizes[2], outputBlob.sizes[3]);
  //console.log(extractResults(outputBlob, img));
  return extractResults(outputBlob, img)
    .map(r => Object.assign({}, r, { className: classNames[r.classLabel] }));
}

const makeDrawClassDetections = predictions => (drawImg, className, getColor, thickness = 2) => {
  predictions
    .filter(p => classNames[p.classLabel] === className)
    .forEach(p => drawRect(drawImg, p.rect, getColor(), { thickness }));
  return drawImg;
};
// **********************************************************************************************************



// Summery: runs object detection on a picture, saves the resulting image with bounding boxes around found objs
// Input: obj of type {id:,url:} and minConf is optional.
// Output:
// Error:
// Comment:
exports.runDetect = async function (obj, minConf = 0.3) {
  let id = obj.id;
  let url = obj.url;
  try {
    await utils.saveImgFromUrl(id, url);
    console.log('runDetect: image should be saved');
    let filenameR = "cam" + id + ".jpg";
    let fullFilenameR = path.join(__dirname, '..', 'data', filenameR)
    let filenameW = "DONEcam" + id + ".jpg";
    let fullFilenameW = path.join(__dirname, '..', 'data', filenameW)
    const img = await cv.imreadAsync(fullFilenameR);

    const minConfidence = minConf
    const predictions = classifyImg(img).filter(res => res.confidence > minConfidence);
    const drawClassDetections = makeDrawClassDetections(predictions);
    const getRandomColor = () => new cv.Vec(Math.random() * 255, Math.random() * 255, 255);
    drawClassDetections(img, 'car', getRandomColor);

    //save file
    cv.imwrite(fullFilenameW, img);
    return { "cam": id, pic: utils.convertImgToBASE64(img) };

  } catch (error) {
    console.log("runDetect IO error: ", error);
  }
}

