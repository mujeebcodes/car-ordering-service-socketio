const Driver = require("./Driver");
const Customer = require("./Customer");
const Order = require("./Order");

class AppService {
  constructor() {
    this.orders = [];
    this.drivers = [];
    this.customers = [];
    this.socketUserMap = new Map();
  }
  joinSession(socket) {
    const { user_type } = socket.handshake.query;
    if (user_type === "driver") {
      const { name, id } = socket.handshake.query;
      const driver = this.drivers.find((driver) => driver.id === id);
      if (driver) {
        this.assignSocket({ socket, user: driver });
        return;
      } else {
        this.createUser({ name, socket, user_type });
      }
    } else if (user_type === "customer") {
      const { name, email } = socket.handshake.query;
      const customer = this.customers.find(
        (customer) => customer.email === email
      );
      if (customer) {
        this.assignSocket({ socket, user: customer });
        return;
      } else {
        this.createUser({ name, email, socket, user_type });
      }
    }
  }

  assignSocket({ socket, user }) {
    console.log("Assigning socket to user", user.name);
    this.socketUserMap.set(user.id, socket);
  }

  sendEvent({ socket, data, eventname }) {
    socket.emit(eventname, data);
  }

  createUser({ name, email, socket, user_type }) {
    switch (user_type) {
      case "driver":
        const driver = new Driver(name);
        this.drivers.push(driver);
        this.assignSocket({ socket, user: driver, user_type });
        this.sendEvent({
          socket,
          data: { driver },
          eventname: "driverCreated",
        });
        console.log("Driver created");
        return driver;
      case "customer":
        const customer = new Customer(name, email);
        this.customers.push(customer);
        this.assignSocket({ socket, user: customer, user_type });
        this.sendEvent({
          socket,
          data: { customer },
          eventname: "customerCreated",
        });
        console.log("customer created", this.customers);
        return customer;
      default:
        throw new Error("Invalid user type");
    }
  }

  requestOrder({ location, destination, price, email }) {
    // const { name, location, destination, price } = data;
    // const newOrder = new Order(location, destination, price, name);
    // console.log(`Customer ${name} is requesting a ride`);
    // return newOrder;
    const customer = this.customers.find(
      (customer) => customer.email === email
    );

    const order = new Order(location, destination, price, customer);

    this.orders.push(order);

    for (const driver of this.drivers) {
      if (driver.in_ride) continue;
      this.sendEvent({
        socket: this.socketUserMap.get(driver.id),
        data: order,
        eventname: "orderRequested",
      });
    }

    console.log("Order requested", order);
    return order;
  }

  acceptOrder(order, driverName) {
    const { id, customer } = order;
    // get all info about order
    const driver = this.drivers.find((driver) => driver.name === driverName);
    const _order = this.orders.find((order) => order.id === id);
    const _customer = this.customers.find(
      (customer) => customer.id === _order.customer.id
    );

    console.log("Accepting order", { _order, driver, _customer });

    _order.assignDriver(driver);
    driver.in_ride = true;

    const userSocket = this.socketUserMap.get(_customer.id);
    userSocket.emit("rideAcceptedData", _order);

    const driverSocket = this.socketUserMap.get(driver.id);
    driverSocket.emit("rideAccepted", _order);

    console.log(_order);
  }
}

module.exports = AppService;
