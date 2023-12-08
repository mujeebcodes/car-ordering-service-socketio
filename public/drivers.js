const driverName = prompt("what's your username?");
const genralNsSocket = io("http://localhost:8000", {
  query: {
    user_type: "driver",
    name: driverName,
  },
});
const driverNsSocket = io("http://localhost:8000/drivers", {
  query: {
    user_type: "driver",
    name: driverName,
  },
});
const notifContainer = document.querySelector("#notification-container");
const acceptBtn = document.querySelector("#acceptBtn");

genralNsSocket.on("connect", () => {
  console.log("Connected");
  genralNsSocket.emit("driverConnect", "driver has connected");
});

driverNsSocket.on("rideRequestData", (order) => {
  console.log(order);
  // Display the received order in the notification container
  const requestDiv = document.createElement("div");
  requestDiv.innerHTML = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Ride Requested by ${order.customer}</strong></h5><div> <p>Location: ${order.location}</p><p>Destination: ${order.destination}</p><p>Price: ${order.price}</p></div><div class="btn-group">
  <button id="acceptBtn" class="btn btn-primary btn-sm">Accept</button>
  <button id="rejectBtn" class="btn btn-primary btn-sm">Reject</button>
</div></div></div>`;

  notifContainer.appendChild(requestDiv);
  // setTimeout(() => {
  //   notifContainer.removeChild(requestDiv);
  //   socket.o
  // }, 1000);

  console.log(order);
});

notifContainer.addEventListener("click", (event) => {
  const target = event.target;

  // Check if the clicked element is the accept button
  if (target.id === "acceptBtn") {
    console.log("accepted ride");
    target.disabled = true;
    target.textContent = "Accepted";
    const rejectBtn = document.querySelector("#rejectBtn");
    if (rejectBtn) {
      rejectBtn.parentElement.removeChild(rejectBtn);
    }
    const queryParameters = genralNsSocket.handshake.query;
    console.log(queryParameters);
    genralNsSocket.emit("rideAccepted");
  } else if (target.id === "rejectBtn") {
    console.log("rejected ride");
    const requestDiv = target.closest(".card");
    requestDiv.remove();
    genralNsSocket.emit("rideRejected", "Ride rejected");
  }
});
