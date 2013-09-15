var express = require('express');
var app = express();
var port = 3700;
var io = require("socket.io").listen(app.listen(port));

var buses = [];

var delta = false;

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


    for (n=0; n<buses.length; n++) {
      if (buses[n] != null &&
            buses[n].vehicleID != null && buses[n].vehicleID == vehicleID) {
        matchFound = true;
        checkIfDelta(n, data.bus[i]);
        break;
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
        destination: data.bus[i].destination,
        offset: data.bus[i].Offset
      };
      buses.push(obj);
    }
  }
}

function checkIfDelta(i, data) {
  if (buses[i].lat != data.lat) {
    console.log(buses[i].lat);
    delta = true;
    buses[i].lat = data.lat;
    console.log(data.lat);
  }
  if (buses[i].lng != data.lng) {
    console.log(buses[i].lng);
    delta = true;
    buses[i].lng = data.lng;
    console.log(data.lng);
  }
  if (buses[i].label != data.label) {
    console.log(buses[i].label);
    delta = true;
    buses[i].label = data.label;
    console.log(data.label);
  }
  if (buses[i].vehicleID != data.VehicleID) {
    console.log(buses[i].vehicleID);
    delta = true;
    buses[i].vehicleID = data.VehicleID;
    console.log(data.VehicleID);
  }
  if (buses[i].blockID != data.BlockID) {
    console.log(buses[i].blockID);
    delta = true;
    buses[i].blockID = data.BlockID;
    console.log(data.BlockID);
  }
  if (buses[i].tripID != data.TripID) {
    console.log(buses[i].tripID);
    delta = true;
    buses[i].tripID = data.TripID;
    console.log(data.TripID);
  }
  if (buses[i].direction != data.Direction) {
    console.log(buses[i].direction);
    delta = true;
    buses[i].direction = data.Direction;
    console.log(data.Direction);
  }
  if (buses[i].destination != data.destination) {
    console.log(buses[i].destination);
    delta = true;
    buses[i].destination = data.destination;
    console.log(data.destination);
  }
  if (buses[i].offset != data.Offset) {
    console.log(buses[i].offset);
    delta = true;
    buses[i].offset = data.Offset;
    console.log(data.Offset);
  }
}

io.sockets.on('connection', function(socket) {
  sendTimedMessage(socket);
});

function sendTimedMessage(socket) {
  // send initial data
  socket.emit('init', { message: getData() });

  // send deltas of the data every 2 seconds
  setInterval(function() {
    getData();
    if (delta == true) {
      socket.emit('delta', { message: 'test' });
      delta = false;
    }
  }, 2000);
}
