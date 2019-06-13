require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//$env:DEBUG='database'
const dblog = require('debug')('database');

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
var db = null;

const connectDB = function() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve();
    } else {
      MongoClient.connect(url, { useNewUrlParser: true }, function(
        err,
        client
      ) {
        assert.equal(null, err);
        dblog('Connected successfully to server');
        db = client.db(dbName);
        resolve();
        //client.close();
      });
    }
  });
};

/**
 *
 * @param {string} collectionName
 * @param {array of object} queryArray
 * @param {*} callback
 */
const insertDocuments = function(collectionName, queryArray, callback) {
  connectDB()
    .then(() => {
      db.collection(collectionName).insertMany(queryArray, function(
        err,
        result
      ) {
        assert.equal(err, null);
        assert.equal(queryArray.length, result.result.n);
        dblog(
          'Inserted ' +
            result.result.n +
            ' documents into the ' +
            collectionName
        );
        dblog(JSON.stringify(result));
        callback(result);
      });
    })
    .catch(err => {
      dblog(err.stack);
    });
};

const findDocuments = async function(collectionName, query = {}, callback) {
  connectDB()
    .then(() => {
      db.collection(collectionName)
        .find(query)
        .toArray(function(err, docs) {
          assert.equal(err, null);
          dblog('Found the following records');
          dblog(docs);
          callback(docs);
        });
    })
    .catch(err => {
      dblog(err.stack);
    });
};

module.exports = {
  insertDocuments,
  findDocuments
};
