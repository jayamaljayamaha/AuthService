import request from "supertest";
import app from "../../../../src/api/v1/app";
import { clearDb, reciveDummyToken } from "../Config/CommonConfigs";

describe("GET /api/v1/users/currentuser", () => {
  beforeEach((done) => {
    clearDb()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should validate the token and send back the user data that stored in that token", (done) => {
    request(app)
      .get("/api/v1/users/currentuser")
      .set("authorization", `Bearer ${reciveDummyToken()}`)
      .expect(200)
      .then((response) => {
        expect(response.body.currentUser.user.email).toEqual(
          "jayamaljayamaha2@gmail.com"
        );
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a 401 error when no auth header is provided", (done) => {
    request(app).get("/api/v1/users/currentuser").expect(401, done);
  });

  it("Should return a 401 error when invalid token is provided", (done) => {
    request(app)
      .get("/api/v1/users/currentuser")
      .set("authorization", `Bearer asdsa@aww34534f$ad`)
      .expect(401, done);
  });
});
