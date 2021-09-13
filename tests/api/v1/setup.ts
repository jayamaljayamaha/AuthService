import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

process.env.JWT_SECRET = "sdfsdfdsf";

let mongo: MongoMemoryServer;
beforeAll((done) => {
  MongoMemoryServer.create().then((mongod) => {
    mongo = mongod;
    const mongoUri = mongo.getUri();
    mongoose
      .connect(mongoUri)
      .then((data) => {
        done();
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

beforeEach(() => {
  mongoose.connection.db.collections().then((collections) => {
    collections.forEach((collection) => {
      collection
        .deleteMany({})
        .then((data) => {})
        .catch((err) => {});
    });
  });
});

afterAll((done) => {
  mongo
    .stop()
    .then((data) => {
      mongoose.connection
        .close()
        .then(() => {
          done();
        })
        .catch((err) => {});
    })
    .catch((err) => {});
});
