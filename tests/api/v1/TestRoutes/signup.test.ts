import request from "supertest";
import app from "../../../../src/api/v1/app";

it("returns a 201 on successfull signup", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with invalid email", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with invalid password", () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "pas",
    })
    .expect(400);
});

it("returns a 400 with empty body", () => {
  return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201);

  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(400);
  done();
});

it("return a token after successfull signup", (done) => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@gmail.com",
      password: "password",
    })
    .expect(201)
    .then((res) => {
      expect(res.body.token).toBeDefined();
      done();
    })
    .catch((err) => {
      done(err);
    });
});
