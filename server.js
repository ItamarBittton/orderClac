var app = require('express')();
var bodyParser = require('body-parser');
var DAL = require('./DAL');
var dal = new DAL();
var counter = 1;
app.use(bodyParser.json());
app.use(require('express').static('client'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/client/view/index.html");
});

app.get('/getInventory', function(req, res){
  
      var callback = function(data) {
          res.send(data);
      }
      dal.SELECT(callback);
});

app.post('/updateInventory', function(req, res){
        var spray = req.body.data;
        dal.UPDATE(spray.name, spray.amount, spray.grainy, spray.type);
        console.log('update' + counter++);
});

app.post('/insertInventory', function(req, res){
        var spray = req.body.data;
        dal.INSERT(spray.name, spray.amount, spray.grainy, spray.type);
        console.log('insert' + counter++);
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});