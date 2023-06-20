const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  await MongoMemoryServer.create().stop();
};
