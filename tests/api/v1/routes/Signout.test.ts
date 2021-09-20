import request from "supertest";
import app from "../../../../src/api/v1/app";
import BlackListToken from "../../../../src/api/v1/Models/BlackListTokens";
import { clearDb, reciveDummyToken } from "../Config/CommonConfigs";

describe("POST /api/v1/users/signout", () => {
  beforeEach((done) => {
    clearDb()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return send back status is signed-out", (done) => {
    request(app)
      .post("/api/v1/users/signout")
      .set("authorization", `Bearer ${reciveDummyToken()}`)
      .expect(200)
      .then((response) => {
        expect(response.body.status).toEqual("signed-out");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should succesfully save dummy token to the database", (done) => {
    const token = reciveDummyToken();
    request(app)
      .post("/api/v1/users/signout")
      .set("authorization", `Bearer ${token}`)
      .expect(200)
      .then(() => {
        return BlackListToken.find({ token: token });
      })
      .then((token) => {
        expect(token).toBeDefined();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a 401 error when no auth header is provided", (done) => {
    request(app).post("/api/v1/users/signout").expect(401, done);
  });

  it("Should return a 401 error when invalid token is provided", (done) => {
    request(app)
      .post("/api/v1/users/signout")
      .set("authorization", `Bearer asdsa@aww34534f$ad`)
      .expect(401, done);
  });
});
