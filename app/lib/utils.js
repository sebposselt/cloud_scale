const path = require('path');
const fs = require('fs');
const request = require('request-promise');
const cv = require("opencv4nodejs");

// code copied from https://github.com/justadudewhohacks/opencv4nodejs/tree/master/examples under MIT-licence
// **********************************************************************************************************
const dataPath = path.resolve(__dirname, '../data');
exports.dataPath = dataPath;
exports.getDataFilePath = fileName => path.resolve(dataPath, fileName);

exports.grabFrames = (videoFile, delay, onFrame) => {
  const cap = new cv.VideoCapture(videoFile);
  let done = false;
  const intvl = setInterval(() => {
    let frame = cap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);
    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
      clearInterval(intvl);
      console.log('Key pressed, exiting.');
    }
  }, 0);
};
exports.drawRectAroundBlobs = (binaryImg, dstImg, minPxSize, fixedRectWidth) => {
  const {
    centroids,
    stats
  } = binaryImg.connectedComponentsWithStats();

  // pretend label 0 is background
  for (let label = 1; label < centroids.rows; label += 1) {
    const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
    const [x2, y2] = [
      x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
      y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
    ];
    const size = stats.at(label, cv.CC_STAT_AREA);
    const blue = new cv.Vec(255, 0, 0);
    if (minPxSize < size) {
      dstImg.drawRectangle(
        new cv.Point(x1, y1),
        new cv.Point(x2, y2),
        { color: blue, thickness: 2 }
      );
    }
  }
};
const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(
    rect,
    color,
    opts.thickness,
    cv.LINE_8
  );
exports.drawRect = drawRect;
exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);

// **********************************************************************************************************
const path = require('path');
const fs = require('fs');
const request = require('request-promise');
const cv = require("opencv4nodejs");

// code copied from https://github.com/justadudewhohacks/opencv4nodejs/tree/master/examples under MIT-licence
// **********************************************************************************************************
const dataPath = path.resolve(__dirname, '../data');
exports.dataPath = dataPath;
exports.getDataFilePath = fileName => path.resolve(dataPath, fileName);

exports.grabFrames = (videoFile, delay, onFrame) => {
  const cap = new cv.VideoCapture(videoFile);
  let done = false;
  const intvl = setInterval(() => {
    let frame = cap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
      cap.reset();
      frame = cap.read();
    }
    onFrame(frame);
    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
      clearInterval(intvl);
      console.log('Key pressed, exiting.');
    }
  }, 0);
};
exports.drawRectAroundBlobs = (binaryImg, dstImg, minPxSize, fixedRectWidth) => {
  const {
    centroids,
    stats
  } = binaryImg.connectedComponentsWithStats();

  // pretend label 0 is background
  for (let label = 1; label < centroids.rows; label += 1) {
    const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
    const [x2, y2] = [
      x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
      y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
    ];
    const size = stats.at(label, cv.CC_STAT_AREA);
    const blue = new cv.Vec(255, 0, 0);
    if (minPxSize < size) {
      dstImg.drawRectangle(
        new cv.Point(x1, y1),
        new cv.Point(x2, y2),
        { color: blue, thickness: 2 }
      );
    }
  }
};
const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(
    rect,
    color,
    opts.thickness,
    cv.LINE_8
  );
exports.drawRect = drawRect;
exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
  drawRect(image, rect, new cv.Vec(0, 0, 255), opts);

// **********************************************************************************************************


exports.cv = cv;
// Summery: Saves an image from an URL in the DATA dir. namingscheme: cam<ID>.jpg
// Input: 
// Output: a promise to be handled by the caller
// Error:
// Comment: Is used async by the caller.
exports.saveImgFromUrl = (id, url) => {
  return new Promise((resolve, reject) => {
    let filename = "cam" + id + ".jpg";
    let fullFilename = path.join(__dirname, '..', 'data', filename)
    request(url, { encoding: 'binary' }, function (error, response, body) {
      if (error) reject(error)

      fs.writeFile(fullFilename, body, 'binary', function (err) {
        if (err) {
          console.log("Error saving imagefile: ", filename);
          console.log("Error:", err);
          reject(err)
        }
        resolve()
      });
    })
  })
};

exports.convertImgToBASE64 = (img) => {
  return cv.imencode(".jpg", img).toString('base64');
};
exports.convertBASE64ToImg = (base64imgstring) => {
  const base64text = base64imgstring;//Base64 encoded string
  const base64data = base64text.replace('data:image/jpg;base64', '')
    .replace('data:image/png;base64', '');//Strip image type prefix
  const buffer = Buffer.from(base64data, 'base64');
  const image = cv.imdecode(buffer); //Image is now represented as Mat
  return image;
}