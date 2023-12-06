const { v4: uuidv4 } = require("uuid");

class Order {
  constructor(location, destination, price) {
    this.location = location;
    this.destination = destination;
    this.price = price;
    this.id = uuidv4();
  }
}
