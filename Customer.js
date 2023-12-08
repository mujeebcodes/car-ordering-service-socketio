const { v4: uuidv4 } = require("uuid");
class Customer {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.user_type = "customer";
  }
  requestRide(order) {}
}

module.exports = Customer;
