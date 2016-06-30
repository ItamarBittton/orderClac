var fs = require('fs');
var file = "inventory.db";
var exists = fs.existsSync(file);
if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

var tableName = "inventory";

if (!exists) {
    db.run("CREATE TABLE " + tableName + " (name TEXT, amount INTEGER, grainy INTEGER, type TEXT)");
    exists = true;
}

var DAL = function(){
    function SELECT(callback) {
            
                 db.serialize(function() {
                    
                    var data = [];
                    db.each("SELECT rowid AS id, name, amount, grainy, type FROM " + tableName, function(err, row) {
                    // console.log(row.id + ": " + row.name + ", " + row.amount + ", " + row.grainy);
                    data.push(row);
                    }, function(){
                        callback(data);
                    });
                });
    }

    function INSERT(name, amount, grainy, type) {
        //db = new sqlite3.Database(file);
            db.serialize(function() {
                
                db.run("INSERT INTO " + tableName + " (name, amount, grainy, type) " +
                 "VALUES ('" + name + "', " + amount + ", " + grainy + ", '" + type + "')", function(){
                    //db.close();
                });
                // db.run("INSERT INTO ? VALUES('?', ?, ?, '?')", [tableName, name, amount, grainy, type], function(){
                //     db.close();
                // });
            });
    }

    function UPDATE(name, amount, grainy, type) {
            db.serialize(function() {
                
                db.run("UPDATE " + tableName +
                                      "SET amount = " + amount +
                                      " WHERE name = '" + name + "' AND " +
                                             "grainy = " + grainy + " AND " +
                                             "type = '" + type + "'");
            });
    }

    function DELETE(name, grainy, type) {
            db.serialize(function() {
                
                db.run("DELETE FROM " + tableName + " WHERE name = " + name  + "' AND " +
                                             "grainy = " + grainy + " AND " +
                                             "type = '" + type + "'");
                                            
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