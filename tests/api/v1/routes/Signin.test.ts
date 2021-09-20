import request from "supertest";
import app from "../../../../src/api/v1/app";
import { clearDb, insertUserDataToDb } from "../Config/CommonConfigs";

describe("POST /api/v1/users/signin", () => {
  beforeEach((done) => {
    clearDb()
      .then(() => {
        return insertUserDataToDb();
      })
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return 200 status response with a token on a successfull login", (done) => {
    request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "jayamaljayamaha2@gmail.com",
        password: "abcd1234",
      })
      .expect(200)
      .then((response) => {
        expect(response.body.token).toBeDefined();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a error on a non existing email", (done) => {
    request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "jayamaljayamaha1@gmail.com",
        password: "abcd1234",
      })
      .expect(404, done);
  });

  it("Should return a error on a invalid password", (done) => {
    request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "jayamaljayamaha2@gmail.com",
        password: "ab123",
      })
      .expect(400, done);
  });

  it("Should return a error on a invalid user data", (done) => {
    request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "jayamaljayamaha2@gmail.com",
      })
      .expect(400, done);
  });
});
