var express = require('express');
var app = express();
var port = 3700;
var io = require("socket.io").listen(app.listen(port));

var data = null;

app.use(express.static(__dirname + '/public'));

function getData() {
  var http = require('http');
  // TODO: replace with dynamic url
  var url = "http://www3.septa.org/hackathon/TransitView/trips.php?route=17";

  http.get(url, function(res) {
    var body = "";
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      // TODO: check if delta
      data = JSON.parse(body)["bus"];
      console.log(data);
    });
  });
}

io.sockets.on('connection', function(socket) {
  // TODO: return initial data
  // socket.emit('init', { message: data });
  sendTimedMessage(socket);
});

function sendTimedMessage(socket) {
  socket.emit('init', { message: 'test' });

  setInterval(function() {
    socket.emit('delta', { message: 'test' });
  }, 2000);
}
