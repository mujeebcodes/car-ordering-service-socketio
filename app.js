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

let requestTimer;

io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
  appService.joinSession(socket);
  // socket.on("customerConnect", (data) => {
  //   console.log(data);
  // });
  // socket.on("driverConnect", (data) => {
  //   console.log(data);
  // });

  socket.on("rideRequested", (order) => {
    // Broadcast the "rideRequested" event to all connected clients
    console.log("Requesting ride", order);
    console.log(socket.handshake.query);
    order.email = socket.handshake.query.email;
    const newOrder = appService.requestOrder(order);

    requestTimer = setTimeout(() => {
      return driversNamespace.emit("rideTimeout", { orderId: newOrder.id });
    }, 6000);
    driversNamespace.emit("rideRequestData", newOrder);
  });

  socket.on("rideAccepted", ({ currentOrder, driverName }) => {
    clearTimeout(requestTimer);
    appService.acceptOrder(currentOrder, driverName);
    // customersNamespace.emit("rideAcceptedData", driverName);
  });
});
