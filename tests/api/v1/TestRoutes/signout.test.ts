import request from "supertest";
import app from "../../../../src/api/v1/app";
import BlackListToken from "../../../../src/api/v1/Models/BlackListTokens";

it("should add the token to the blacklist in db after signout", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .then((res) => {
      request(app)
        .post("/api/users/signout")
        .set("authorization", `Bearer ${res.body.token}`)
        .expect(200)
        .then((res2) => {
          BlackListToken.findOne({ token: res.body.token }).then((token) => {
            expect(token).not.toBeNull();
            done();
          });
        })
        .catch((err) => {
          done(err);
        });
    });
});
