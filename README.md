septa-push
==========

Real time pushing of the deltas of SEPTA bus data using node.js and socket.io

### Why use this

SEPTA's API (http://www3.septa.org/hackathon) is a real time location tracker for buses and trains, however it requires pulling of data (e.g. there is no server to recieve push data).
With septa-push, you have a server that uses the SEPTA API to push only the deltas of your data.

### How to use

Connect socket to localhost
<br>
<code>
var socket = io.connect("http://localhost:3700");
</code>

Once connected, the server will send you the initial data
<br>
<code>
socket.on('init', function(data) {
  ...
});
</code>

All messages after the initial message will be sent when there is a delta of your data
<br>
<code>
socket.on('delta', function(data) {
  ...
});
</code>

### Settings

All settings such as the url to request data from (which bus to get data for), the port number, the frequency of pushing data, etc is in index.js. Please feel free to modify the source code as required.
### Limitations

As of now this only supports SEPTA buses
  
