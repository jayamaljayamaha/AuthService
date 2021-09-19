import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { clearDb } from "./CommonConfigs";

let mongoDbMemoryInstance: MongoMemoryServer;
beforeAll((done) => {
  MongoMemoryServer.create()
    .then((instance) => {
      mongoDbMemoryInstance = instance;
      const mongoUri = mongoDbMemoryInstance.getUri();
      return mongoose.connect(mongoUri);
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  mongoDbMemoryInstance
    .stop()
    .then(() => {
      return mongoose.connection.close();
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});
