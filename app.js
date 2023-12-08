const express = require("express");
const app = express();
const socketio = require("socket.io");
const AppService = require("./AppService");

app.use(express.static(__dirname + "/public"));

const appService = new AppService();
const expressServer = app.listen(8000);
const io = socketio(expressServer);

const driversNamespace = io.of("/drivers");
const customersNamespace = io.of("/customers");

io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
  socket.on("customerConnect", (data) => {
    console.log(data);
  });
  socket.on("driverConnect", (data) => {
    console.log(data);
  });

  socket.on("rideRequested", (order) => {
    // Broadcast the "rideRequested" event to all connected clients
    const newOrder = appService.requestOrder(order);
    driversNamespace.emit("rideRequestData", newOrder);
  });

  socket.on("rideAccepted", () => {
    console.log(driversNamespace.handshake.query);
  });
});
