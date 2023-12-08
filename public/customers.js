const socket = io("http://localhost:8000", {
  query: {
    user_type: "customer",
  },
});
const requestForm = document.querySelector("#request-form");
const notifContainer = document.querySelector("#notification-container");

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("customerConnect", "Customer has connected");
});

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const order = {
    name: e.target[0].value,
    location: e.target[1].value,
    destination: e.target[2].value,
    price: e.target[3].value,
  };

  const requestDiv = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Ride Requested by ${order.name}</strong></h5><div> <p>Location: ${order.location}</p><p>Destination: ${order.destination}</p><p>Price: ${order.price}</p></div><a href="#" class="btn btn-primary">Go somewhere</a></div></div>`;
  notifContainer.innerHTML = requestDiv;

  socket.emit("rideRequested", order);
});
