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
let currentOrder;
let requestDiv;

genralNsSocket.on("connect", () => {
  console.log("Connected");
  genralNsSocket.emit("driverConnect", "driver has connected");
});

driverNsSocket.on("rideRequestData", (order) => {
  console.log(order);
  currentOrder = order;
  // Display the received order in the notification container
  requestDiv = document.createElement("div");
  requestDiv.innerHTML = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Ride Requested by ${order.customer.name}</strong></h5><div> <p>Location: ${order.location}</p><p>Destination: ${order.destination}</p><p>Price: ${order.price}</p></div><div class="btn-group">
  <button class="btn btn-primary btn-sm acceptBtn">Accept</button>
  <button class="btn btn-primary btn-sm rejectBtn">Reject</button>
</div></div></div>`;

  notifContainer.appendChild(requestDiv);
  // setTimeout(() => {
  //   notifContainer.removeChild(requestDiv);
  //   socket.o
  // }, 1000);

  console.log(order);
});

driverNsSocket.on("rideTimeout", ({ orderId }) => {
  console.log(orderId);
  if (currentOrder && currentOrder.id === orderId) {
    // Remove the requestDiv if it exists
    if (requestDiv) {
      requestDiv.remove();
    }
    // Handle any additional logic when a ride times out
  }
});

notifContainer.addEventListener("click", (event) => {
  const target = event.target;

  // Check if the clicked element is the accept button
  if (target.classList.contains("acceptBtn")) {
    console.log("accepted ride");
    target.disabled = true;
    target.textContent = "Accepted";
    const rejectBtn = target.nextElementSibling;
    if (rejectBtn) {
      rejectBtn.parentElement.removeChild(rejectBtn);
    }
    genralNsSocket.emit("rideAccepted", { currentOrder, driverName });
  } else if (target.classList.contains("rejectBtn")) {
    console.log("rejected ride");
    const requestDiv = target.closest(".card");
    requestDiv.remove();
    genralNsSocket.emit("rideRejected", "Ride rejected");
  }
});
