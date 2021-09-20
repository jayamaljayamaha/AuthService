import request from "supertest";
import app from "../../../../src/api/v1/app";
import { clearDb, insertUserDataToDb } from "../Config/CommonConfigs";

describe("POST /api/v1/users/signup", () => {
  beforeEach((done) => {
    clearDb()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  const user = {
    firstname: "jayamal",
    lastname: "jayamaha",
    email: "jayamaljayamaha2@gmail.com",
    password: "abcd1234",
  };
  const invalidUser = {
    firstname: "jayamal",
    lastname: "jayamaha",
    password: "abcd1234",
  };
  it("Should return data that has type of UserReturnType with 201 status code", (done) => {
    request(app)
      .post("/api/v1/users/signup")
      .send(user)
      .expect(201)
      .then((response) => {
        expect(response.body).toBeDefined();
        expect(response.body.user.email).toEqual(user.email);
        expect(response.body.token).toBeDefined();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a error when provide a invalid user object", (done) => {
    request(app)
      .post("/api/v1/users/signup")
      .send(invalidUser)
      .expect(400, done);
  });

  it("Should return a error on inserting a user with a duplicate email", (done) => {
    insertUserDataToDb()
      .then(() => {
        request(app).post("/api/v1/users/signup").send(user).expect(500, done);
      })
      .catch((err) => {
        done(err);
      });
  });
});
