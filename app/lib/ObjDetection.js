const request = require('request-promise');
const {drawRect,} = require('./utils');
const utils = require('./utils');
const cv = require("opencv4nodejs");
const fs = require('fs');
const path = require('path');
const classNames = require('./dnnCocoClassNames');
const { extractResults } = require('./dnn/ssdUtils');

if (!cv.xmodules.dnn) {
  throw new Error('exiting: opencv4nodejs compiled without dnn module');
}

// replace with path where you unzipped inception model
const ssdcocoModelPath = '/Users/datamat/Documents/qut/cloud/sandbox/models/VGGNet/coco/SSD_300x300';

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


exports.runDetect = async function (url, id, minConf = 0.3)
{
  try {
    await utils.saveImg(url, id);
    // console.log('runDetect: image should be saved')
    let filenameR = "cam" + id + ".jpg";
    let fullFilenameR = path.join(__dirname, '..', 'data', filenameR)
    let filenameW = "DONEcam" + id + ".jpg";
    let fullFilenameW = path.join(__dirname, '..', 'data', filenameW)
    const img = await cv.imreadAsync(fullFilenameR);
    // console.log("read")

    const minConfidence = minConf
    const predictions = classifyImg(img).filter(res => res.confidence > minConfidence);
    const drawClassDetections = makeDrawClassDetections(predictions);
    const getRandomColor = () => new cv.Vec(Math.random() * 255, Math.random() * 255, 255);
    drawClassDetections(img, 'car', getRandomColor);
    
    cv.imwrite(fullFilenameW,img);  

  } catch (error) {
    console.log("runDetect error: ",error);
  }
  
};

