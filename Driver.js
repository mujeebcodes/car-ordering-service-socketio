const { v4: uuidv4 } = require("uuid");

class Driver {
  constructor(id, name) {
    this.id = uuidv4();
    this.name = name;
    this.user_type = "driver";
  }

  acceptOrder(order) {}

  rejectOrder(order) {}
}

module.exports = Driver;
