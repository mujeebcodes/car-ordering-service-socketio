const socket = io("http://localhost:8000");
const notifContainer = document.querySelector("#notification-container");

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("driverConnect", "driver has connected");
});

socket.on("rideRequestedData", (data) => {
  // Display the received data in the notification container
  const requestDiv = document.createElement("div");
  requestDiv.innerHTML = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Ride Requested by ${data.name}</strong></h5><div> <p>Location: ${data.location}</p><p>Destination: ${data.destination}</p><p>Price: ${data.price}</p></div><div class="btn-group">
  <button class="btn btn-primary btn-sm">Accept</button>
  <button class="btn btn-primary btn-sm">Reject</button>
</div></div></div>`;
  notifContainer.appendChild(requestDiv);
  console.log(data);
});
