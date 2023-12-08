const Driver = require("./Driver");
const Customer = require("./Customer");
const Order = require("./Order");

class AppService {
  constructor() {
    this.orders = [];
    this.drivers = [];
    this.customers = [];
  }

  //   joinSession(socket) {}

  //   assignSocket() {}

  requestOrder(data) {
    const { name, location, destination, price } = data;
    const newOrder = new Order(location, destination, price, name);
    console.log(`Customer ${name} is requesting a ride`);
    return newOrder;
  }

  acceptOrder(order) {}
}

module.exports = AppService;
