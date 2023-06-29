const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let isConnected = false;

module.exports.connect = async () => {
  if (!isConnected) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    await mongoose.connect(uri, mongooseOpts);
    isConnected = true;
  }
};

module.exports.closeDatabase = async () => {
  if (isConnected) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();

    isConnected = false;
  }
};

module.exports.clearDatabase = async () => {
  if (isConnected) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};
