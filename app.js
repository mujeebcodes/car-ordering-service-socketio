const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000);
const io = socketio(expressServer);

io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
  socket.on("customerConnect", (data) => {
    console.log(data);
  });
  socket.on("driverConnect", (data) => {
    console.log(data);
  });

  socket.on("rideRequested", (data) => {
    // Broadcast the "rideRequested" event to all connected clients
    io.emit("rideRequestedData", data);
  });
});
