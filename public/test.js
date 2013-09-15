window.onload = function() {
  var socket = io.connect("http://localhost:3700");

  socket.on('init', function(data) {
    console.log(data.message);
  });

  socket.on('delta', function(data) {
    console.log(data.message);
  })
}
