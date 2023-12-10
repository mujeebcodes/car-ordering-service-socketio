const customerName = prompt("What's your name?");
const customerEmail = prompt("What's your email?");
const socket = io("http://localhost:8000", {
  query: {
    user_type: "customer",
    name: customerName,
    email: customerEmail,
  },
});
const requestForm = document.querySelector("#request-form");
const notifContainer = document.querySelector("#notification-container");

let requestTimer;
let requestDiv;

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("customerConnect", "Customer has connected");
});

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  while (notifContainer.firstChild) {
    notifContainer.removeChild(notifContainer.firstChild);
  }

  const order = {
    location: e.target[0].value,
    destination: e.target[1].value,
    price: e.target[2].value,
    // name: e.target[0].value,
    // email: e.target[1].value,
  };

  // requestDiv = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Ride Requested by ${customerName}</strong></h5><div> <p>Location: ${order.location}</p><p>Destination: ${order.destination}</p><p>Price: ${order.price}</p></div><a href="#" class="btn btn-primary">Go somewhere</a></div></div>`;
  requestDiv = document.createElement("div");
  requestDiv.innerHTML = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Looking for a driver for you, ${customerName}</strong></h5><div><p>Your ride details: </p> <p>Location: ${order.location}</p><p>Destination: ${order.destination}</p><p>Price: ${order.price}</p></div></div></div>`;
  notifContainer.appendChild(requestDiv);

  socket.emit("rideRequested", order);
  requestTimer = setTimeout(() => {
    notifyCustomerNoDriverFound();
  }, 6000);
});

socket.on("rideAcceptedData", (order) => {
  const { destination, location, price, driver } = order;
  clearTimeout(requestTimer);
  console.log(order);
  requestDiv.innerHTML = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Good News, ${customerName}. Driver ${driver.name}  has accepted your ride!</strong></h5><div><p>Your ride details: </p> <p>Location: ${location}</p><p>Destination: ${destination}</p><p>Price: ${price}</p></div></div></div>`;
});

function notifyCustomerNoDriverFound() {
  // Clear existing notifications
  while (notifContainer.firstChild) {
    notifContainer.removeChild(notifContainer.firstChild);
  }
  clearTimeout(requestTimer);
  socket.emit("rideTimeout");

  // Notify the customer that no driver was found
  const notificationDiv = document.createElement("div");
  notificationDiv.innerHTML = "<p>No driver found. Please try again.</p>";
  notifContainer.appendChild(notificationDiv);

  // Clear the request notification
  if (requestDiv && requestDiv.parentNode) {
    requestDiv.parentNode.removeChild(requestDiv);
  }
}
