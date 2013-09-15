var express = require('express');
var app = express();
var port = 3700;
var io = require("socket.io").listen(app.listen(port));

var buses = [];

app.use(express.static(__dirname + '/public'));

function getData() {
  var http = require('http');
  // TODO: replace with dynamic url
  var url = "http://www3.septa.org/hackathon/TransitView/trips.php?route=17";
  var data = null;

  http.get(url, function(res) {
    var body = "";
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {
      data = JSON.parse(body);
      return parseData(data);
    });
  });
}

function parseData(data) {
  for (i=0; i<data.bus.length; i++) {
    var vehicleID = data.bus[i].VehicleID;
    var matchFound = false;

    for (n=0; n<data.length; n++) {
      if (data[n].vehicleID == vehicleID) {
        matchFound = true;
        // TODO: match found, have to check if delta
      }
    }

    if (matchFound == false) {
      var obj = {
        lat: data.bus[i].lat,
        lng: data.bus[i].lng,
        label: data.bus[i].label,
        vehicleID: data.bus[i].VehicleID,
        blockID: data.bus[i].BlockID,
        tripID: data.bus[i].TripID,
        direction: data.bus[i].Direction,
        offset: data.bus[i].Offset
      };
      buses.push(obj);
    }
  }
}

function getDelta() {

}

io.sockets.on('connection', function(socket) {
  sendTimedMessage(socket);
});

function sendTimedMessage(socket) {
  // send initial data
  socket.emit('init', { message: getData() });

  // send deltas of the data every 2 seconds
  setInterval(function() {
    socket.emit('delta', { message: 'test' });
  }, 2000);
}
