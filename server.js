var app = require('express')();
var bodyParser = require('body-parser');
var DAL = require('./DAL');
var dal = new DAL();
var counter = 1;
app.use(bodyParser.json());
app.use(require('express').static('client'));

function cmpCurrObj(obj, element){
    return (obj.name == element.name &&
            obj.grainy == element.grainy &&
            obj.type == element.type ? true : false);
}

function findIfInArray(obj, array) {
    var bool = false;
    array.forEach(function(element){
        if(cmpCurrObj(obj, element)){
            bool = true;
        }        
    });

    return bool;
}

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/client/view/index.html");
});

app.get('/getInventory', function(req, res){
  
      var callback = function(data) {
          res.send(data);
      }

      dal.SELECT(callback);
});

app.post('/sendSending', function(req, res){
    var updateArray = [];
    var insertArray = [];
    var counterCallback = 0;

    var anotherCallBack = function(){
        console.log("callback " + counterCallback);
        if (counterCallback < updateArray.length) {
            dal.UPDATE(updateArray[counterCallback], anotherCallBack);
            console.log('update' + counter++);
        } else {
            res.send(null);
        }
        counterCallback++;
    }

    var callback = function(data) {
        req.body.data.forEach(function(element) {
            if (findIfInArray(element, data)){
                updateArray.push(element);
            } else {
                insertArray.push(element);
            }
        });

        if(insertArray.length) {
            dal.INSERT(insertArray, anotherCallBack);
            console.log('insert' + counter++);
        } else {
            anotherCallBack();
        }
    }

    dal.SELECT(callback);
});

app.post('/updateInventory', function(req, res){
        var spray = req.body.data;
        var counterCallback = 0;
        var callback = function() {
            console.log("callback " + counterCallback);
            counterCallback++;
            if (counterCallback < spray.length) {
                dal.UPDATE(spray[counterCallback], callback);
            }
        }

        dal.UPDATE(spray[counterCallback], callback);

        console.log('update' + counter++);
});

app.post('/insertInventory', function(req, res){
        var sprayArray = req.body.data;
        dal.INSERT(sprayArray, function(err){
            res.send(err);
        });
        console.log('insert' + counter++);
});

app.delete('/deleteInventory', function(req, res){
    var deleteArray = req.body.data;
    var counterCallback = 0;

    var callback = function(){
        console.log("callback " + counterCallback);
        if (counterCallback < deleteArray.length) {
            dal.DELETE(deleteArray[counterCallback], callback);
            console.log('update' + counter++);
        } else {
            res.send(null);
        }
        counterCallback++;
    }

    callback();
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});