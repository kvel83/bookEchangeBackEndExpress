const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  global.__MONGO_URI__ = await MongoMemoryServer.create().getUri();
};
