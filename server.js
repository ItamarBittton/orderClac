var app = require('express')();
var bodyParser = require('body-parser');
var fs = require('fs');
var obj;

app.use(bodyParser.json());
app.use(require('express').static('client'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/client/view/index.html");
});

app.get('/getInventory', function(req, res){
  fs.readFile(__dirname + "/client/files/inventory.json", 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    res.send(obj);
  });
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});