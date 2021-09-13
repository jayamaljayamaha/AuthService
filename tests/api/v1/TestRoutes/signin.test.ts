import request from "supertest";
import app from "../../../../src/api/v1/app";

it("fails when a email that does not exist supplied", () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(404);
});

it("fails when a incorrect password supplied", async () => {
  await request(app).post("/api/users/signup").send({
    email: "test@gmail.com",
    password: "password",
  });

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@gmail.com",
      password: "123",
    })
    .expect(400);
});

it("responds with a token with valid credentials", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .then((res) => {
      request(app)
        .post("/api/users/signin")
        .send({
          email: "test@gmail.com",
          password: "password",
        })
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
});
