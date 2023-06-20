const NodeEnvironment = require('jest-environment-node');
const mockgoose = require('mockgoose');
const mongoose = require('mongoose');

class CustomTestEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    await mockgoose(mongoose);
    await mongoose.connect('mongodb://localhost/test');
  }

  async teardown() {
    await mongoose.disconnect();

    await super.teardown();
  }
}

module.exports = CustomTestEnvironment;
