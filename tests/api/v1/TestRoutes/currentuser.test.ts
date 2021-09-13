import request from "supertest";
import app from "../../../../src/api/v1/app";

it("should give success response when get current user after signup", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .then((res) => {
      request(app)
        .get("/api/users/currentuser")
        .set("authorization", `Bearer ${res.body.token}`)
        .expect(200)
        .then((res2) => {
          expect(res2.body.currentUser.user.email).toEqual("test@gmail.com");
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
});

it("responds with null if not authenticated", (done) => {
  request(app)
    .get("/api/users/currentuser")
    .expect(401)
    .then((res2) => {
      expect(res2.body.currentUser).toBeUndefined();
      done();
    })
    .catch((err) => {
      done(err);
    });
});
