const { v4: uuidv4 } = require("uuid");
class Sender {
  constructor(name, email) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
  }
  requestRide() {}
}

module.exports = Sender;
