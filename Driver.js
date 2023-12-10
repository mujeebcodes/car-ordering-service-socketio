const { v4: uuidv4 } = require("uuid");

class Driver {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.in_ride = false;
  }

  acceptOrder(order) {
    console.log(`${this.name} accepts order ${order.id}`);
    order.assignDriver(this);
  }

  rejectOrder(order) {
    console.log(`${this.name} rejects order ${order.id}`);
  }
}

module.exports = Driver;
