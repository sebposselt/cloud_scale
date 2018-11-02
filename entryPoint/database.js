const mongoClient = require("mongodb").MongoClient;
const assert = require('assert');




// Connection URL
const url = "mongodb://cab432:b4a7SvudCNdHlNg04looE6KsbwxanHSIGnLmXpsXk34UMVpzWKFWyFPWaTSABo0cilJZ0E4p45h7ifr3F4XjIQ%3D%3D@cab432.documents.azure.com:10255/?ssl=true"
// Database and Collection Names
const dbName = 'MaybeCars';
const collectionName = 'MaybeCars';



const findDocuments = function (ids, db, callback) {
    q = [];
    for (let i = 0; i < ids.length; i++) {
        const elm = ids[i];
        tmp = {"cam": parseInt(elm)};
        q.push(tmp);
    }
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({$or: q}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}




exports.findImage = function (IDsofObjs, callback) {
    mongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        // the target DB
        const db = client.db(dbName);
        findDocuments(IDsofObjs, db, function (docs) {
            client.close();
            callback(docs);
        });
    });

}












