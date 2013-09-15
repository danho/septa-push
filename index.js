var express = require('express');
var app = express();
var port = 3700;
var io = require("socket.io").listen(app.listen(port));

var buses = [];

var delta = false;

var data = null;

app.use(express.static(__dirname + '/public'));

function sendData(socket) {
  var http = require('http');
  // TODO: replace with dynamic url
  var url = "http://www3.septa.org/hackathon/TransitView/trips.php?route=17";

  http.get(url, function(res) {
    var body = "";
    res.on('data', function(chunk) {
      body += chunk;
    });
    res.on('end', function() {

      // init
      if (data == null) {
        data = JSON.parse(body);
        parseData(data);
        socket.emit('init', { message: data });
        return;
      }

      data = JSON.parse(body);
      parseData(data);

      if (delta == true) {
        delta = false;
        socket.emit('delta', { message: data });
      }
    });
  });
}

function parseData(raw_data) {
  for (i=0; i<raw_data.bus.length; i++) {
    var vehicleID = raw_data.bus[i].VehicleID;
    var matchFound = false;


    for (n=0; n<buses.length; n++) {
      if (buses[n] != null &&
            buses[n].vehicleID != null && buses[n].vehicleID == vehicleID) {
        matchFound = true;
        checkIfDelta(n, raw_data.bus[i]);
        break;
      }
    }

    if (matchFound == false) {
      var obj = {
        lat: raw_data.bus[i].lat,
        lng: raw_data.bus[i].lng,
        label: raw_data.bus[i].label,
        vehicleID: raw_data.bus[i].VehicleID,
        blockID: raw_data.bus[i].BlockID,
        tripID: raw_data.bus[i].TripID,
        direction: raw_data.bus[i].Direction,
        destination: raw_data.bus[i].destination,
        offset: raw_data.bus[i].Offset
      };
      buses.push(obj);
    }
  }
}

function checkIfDelta(i, raw_data) {
  if (buses[i].lat != raw_data.lat) {
    // console.log(buses[i].lat);
    delta = true;
    buses[i].lat = raw_data.lat;
    // console.log(raw_data.lat);
  }
  if (buses[i].lng != raw_data.lng) {
    // console.log(buses[i].lng);
    delta = true;
    buses[i].lng = raw_data.lng;
    // console.log(raw_data.lng);
  }
  if (buses[i].label != raw_data.label) {
    // console.log(buses[i].label);
    delta = true;
    buses[i].label = raw_data.label;
    // console.log(raw_data.label);
  }
  if (buses[i].vehicleID != raw_data.VehicleID) {
    // console.log(buses[i].vehicleID);
    delta = true;
    buses[i].vehicleID = raw_data.VehicleID;
    // console.log(raw_data.VehicleID);
  }
  if (buses[i].blockID != raw_data.BlockID) {
    // console.log(buses[i].blockID);
    delta = true;
    buses[i].blockID = raw_data.BlockID;
    // console.log(raw_data.BlockID);
  }
  if (buses[i].tripID != raw_data.TripID) {
    // console.log(buses[i].tripID);
    delta = true;
    buses[i].tripID = raw_data.TripID;
    // console.log(raw_data.TripID);
  }
  if (buses[i].direction != raw_data.Direction) {
    // console.log(buses[i].direction);
    delta = true;
    buses[i].direction = raw_data.Direction;
    // console.log(raw_data.Direction);
  }
  if (buses[i].destination != raw_data.destination) {
    // console.log(buses[i].destination);
    delta = true;
    buses[i].destination = raw_data.destination;
    // console.log(raw_data.destination);
  }
  if (buses[i].offset != raw_data.Offset) {
    // console.log(buses[i].offset);
    delta = true;
    buses[i].offset = raw_data.Offset;
    // console.log(raw_data.Offset);
  }
}

io.sockets.on('connection', function(socket) {
  sendTimedMessage(socket);
});

function sendTimedMessage(socket) {
  // send initial data
  sendData(socket);

  // send deltas of the data every 2 seconds
  setInterval(function() {
    sendData(socket);
    // if (delta == true) {
      // delta = false;
    // }
  }, 2000);
}
