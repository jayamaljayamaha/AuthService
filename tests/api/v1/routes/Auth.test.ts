import { response } from "express";
import request from "supertest";
import app from "../../../../src/api/v1/app";
import BlackListToken from "../../../../src/api/v1/Models/BlackListTokens";
import {
  clearDb,
  insertUserDataToDb,
  reciveDummyToken,
} from "../Config/CommonConfigs";

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
