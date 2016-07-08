//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = "mongodb://admin:admin@ds011715.mlab.com:11715/heroku_xr97802w";

// var fs = require('fs');
// var file = "inventory.db";
// var exists = fs.existsSync(file);
// if(!exists) {
//   console.log("Creating DB file.");
//   fs.openSync(file, "w");
// }
// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database(file);

var collectionName = "inventory";

// if (!exists) {
//     db.run("CREATE TABLE " + tableName + " (name TEXT, amount INTEGER, grainy INTEGER, type TEXT)");
//     exists = true;
// }

var DAL = function(){
    function SELECT(callback) {
            
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            var collection = db.collection(collectionName);
            collection.find({}, {"_id" : 0}).toArray(function(err, result){
                if(err){
                    console.log('cannot find the current collection', err);
                } else if (result.length){
                    callback(result);
                } else {
                    console.log('the current collection has no results');
                }

                //Close connection
                db.close();
            });
        }
        });
                //  db.serialize(function() {
                    
                //     var data = [];
                //     db.each("SELECT rowid AS id, name, amount, grainy, type FROM " + tableName, function(err, row) {
                //     // console.log(row.id + ": " + row.name + ", " + row.amount + ", " + row.grainy);
                //     data.push(row);
                //     }, function(){
                //         callback(data);
                //     });
                // });
    }

    function INSERT(insertArray, callback) {
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                //console.log('Connection established to', url);
                var collection = db.collection(collectionName);
                collection.insert(insertArray, function(err){
                    
                    //Close connection
                    db.close();

                    if(err){
                        console.log(err);   
                    } else {
                        callback();
                    }
                });
            }
        });
        //db = new sqlite3.Database(file);

            // db.serialize(function() {
                
            //     db.run("INSERT INTO " + tableName + " (name, amount, grainy, type) " +
            //      "VALUES ('" + name + "', " + amount + ", " + grainy + ", '" + type + "')", function(){
            //         //db.close();
            //     });
            //     // db.run("INSERT INTO ? VALUES('?', ?, ?, '?')", [tableName, name, amount, grainy, type], function(){
            //     //     db.close();
            //     // });
            // });
    }

    function UPDATE(spray, callback) {
            MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                //console.log('Connection established to', url);
                var collection = db.collection(collectionName);
                collection.updateOne({"name" : spray.name, "grainy" : spray.grainy, "type" : spray.type}, {$inc : {amount : spray.amount}}, function(err, result){

                    //Close connection
                    db.close();
                    
                    if(err){
                        console.log(err);   
                    } else {
                        callback();
                    }
                });
            }
        });
            // db.serialize(function() {
                
            //     db.run("UPDATE " + tableName +
            //                           "SET amount = " + amount +
            //                           " WHERE name = '" + name + "' AND " +
            //                                  "grainy = " + grainy + " AND " +
            //                                  "type = '" + type + "'");
            // });
    }

    function DELETE(spray, callback) {
            // db.serialize(function() {
                
            //     db.run("DELETE FROM " + tableName + " WHERE name = " + name  + "' AND " +
            //                                  "grainy = " + grainy + " AND " +
            //                                  "type = '" + type + "'");
                                            
            // });
            MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                //HURRAY!! We are connected. :)
                //console.log('Connection established to', url);
                var collection = db.collection(collectionName);
                try {
                    collection.deleteOne( {"name" : spray.name, "grainy" : spray.grainy, "type" : spray.type} , function(err){
                            
                        //Close connection
                        db.close();

                        if(err){
                            console.log(err);   
                        } else {
                            callback();
                        }
                    });
                } catch (e) {
                    console.log(e);
                }                
            }
        });
    }

    return {
        SELECT : SELECT,
        INSERT : INSERT,
        UPDATE : UPDATE,
        DELETE : DELETE
    }
}

module.exports = DAL;