const socket = io("http://localhost:8000");
const requestForm = document.querySelector("#request-form");
const notifContainer = document.querySelector("#notification-container");

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("customerConnect", "Customer has connected");
});

requestForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    name: e.target[0].value,
    email: e.target[1].value,
    location: e.target[2].value,
    destination: e.target[3].value,
    price: e.target[4].value,
  };

  const requestDiv = `<div class="card" style="width: 100%"><div class="card-body"<h5 class="card-title"><strong>Ride Requested by ${data.name}</strong></h5><div> <p>Location: ${data.location}</p><p>Destination: ${data.destination}</p><p>Price: ${data.price}</p></div><a href="#" class="btn btn-primary">Go somewhere</a></div></div>`;
  notifContainer.innerHTML = requestDiv;

  socket.emit("rideRequested", data);
});
