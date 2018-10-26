const mongoClient = require("mongodb").MongoClient;
const assert = require('assert');

// Connection URL
const url = "mongodb://cab432:b4a7SvudCNdHlNg04looE6KsbwxanHSIGnLmXpsXk34UMVpzWKFWyFPWaTSABo0cilJZ0E4p45h7ifr3F4XjIQ%3D%3D@cab432.documents.azure.com:10255/?ssl=true"
// Database and Collection Names
const dbName = 'MaybeCars';
const collectionName = 'MaybeCars';


const insertPicture = function(arrOfObjs,db,callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Insert stuff
    collection.insertMany(arrOfObjs, function (err, result) {
        len = arrOfObjs.length;
        assert.equal(err, null);
        // assert.equal(len, result.result.n);
        // assert.equal(len, result.ops.length);
        //error handling stuff done here
        console.log("Inserted " + len+ " pictures to DB");
        callback(result);
    });
}
const removeDocument = function (IDofObj, db, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Delete document where a is 3
    collection.deleteOne({ "cam": IDofObj }, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with id: ", IDofObj);
        callback(result);
    });
}

const updateDocument = function (id, img, db, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    collection.updateOne(
        { "cam": id },
        { $set: { "pic": img } }, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with id: ", id);
            callback(result);
        });
}

const findDocuments = function (id, db, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({ 'cam': id }).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs);
        // return stuff
        callback(docs);
    });
}
const clear = function (db) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Delete document where a is 3
    collection.remove({});
}














exports.findImage = function (IDofObj) {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);
        findDocuments(IDofObj, db, function () {
            client.close();
        });
    });
}


exports.updateImage = function (IDofObj,newPic) {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);
        updateDocument(IDofObj,newPic, db, function () {
            client.close();
        });
    });
}

exports.deleteOne =function(IDofObj){
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);

        removeDocument(IDofObj, db, function () {
            client.close();
        });
    });
}

exports.pushPicture = function (arrOfObjs) {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);

        insertPicture(arrOfObjs,db,function () {
            client.close();
        });
    });
}

exports.clearDB = function () {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);

        clear(db)
        client.close();
    });
}


exports.bulkUpload = function (arrOfObjs) {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        let bulk = collection.initializeUnorderedBulkOp();

        for (let i = 0; i < arrOfObjs.length; i++) {
            const elm = arrOfObjs[i];
            bulk.find({ "cam": elm.cam }).upsert().update(
                {
                    $set: { "pic": elm.pic },
                    $setOnInsert: { "cam": elm.cam }
                });
        }
        bulk.execute();
        client.close();
    });
}