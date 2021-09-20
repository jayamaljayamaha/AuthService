import { UserReturnType } from "../../../../src/api/v1/DataTypes/Types";
import BlackListToken from "../../../../src/api/v1/Models/BlackListTokens";
import User from "../../../../src/api/v1/Models/User";
import {
  auth,
  invalidateToken,
  signup,
  validateAuthData,
} from "../../../../src/api/v1/Services/AuthService";
import UserSigninSchema from "../../../../src/api/v1/ValidationSchemas/UserSigninSchema";
import { clearDb, insertUserDataToDb } from "../Config/CommonConfigs";

describe("validateAuthData of AuthService", () => {
  const validSigninData = {
    email: "test@gmail.com",
    password: "abc123",
  };

  const invalidSigninData = {
    email: "test@gmail.com",
    pas: "abc123",
  };
  it("Should return undefined error object on valid data object", (done) => {
    const isValid = validateAuthData(validSigninData, UserSigninSchema);
    expect(isValid.error).not.toBeDefined();
    done();
  });

  it("Should return defined error object on invalid data object", (done) => {
    const isValid = validateAuthData(invalidSigninData, UserSigninSchema);
    expect(isValid.error).toBeDefined();
    done();
  });
});

describe("auth of AuthService", () => {
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

  const signinData = {
    email: "jayamaljayamaha2@gmail.com",
    password: "abcd1234",
  };

  const falseSigninData = {
    email: "jayamaljayamaha2@gmail.com",
    password: "abcd123",
  };

  const nonExistingSigninData = {
    email: "jayamaljayamaha1@gmail.com",
    password: "abcd123",
  };
  it("Should return a promise with data and jwt token on successfull login", (done) => {
    auth(signinData)
      .then((response: UserReturnType) => {
        expect(response.user.email).toEqual(signinData.email);
        expect(response.token).toBeDefined();
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a promise with error on a false signin data", (done) => {
    expect.assertions(1);
    auth(falseSigninData).catch((err) => {
      expect(err).toBeDefined();
      done();
    });
  });

  it("Should return a promise with error on a non existing signin data", (done) => {
    expect.assertions(1);
    auth(nonExistingSigninData).catch((err) => {
      expect(err).toBeDefined();
      done();
    });
  });
});

describe("invalidateToken of AuthService", () => {
  beforeEach((done) => {
    clearDb()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  it("Should successfully save the token to the database", (done) => {
    invalidateToken(token)
      .then(() => {
        return BlackListToken.findOne({ token: token });
      })
      .then((res: any) => {
        expect(res).toBeDefined();
        expect(res.token).toEqual(token);
        done();
      })
      .catch((err: Error) => {
        done(err);
      });
  });
});

describe("signup of AuthService", () => {
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

  it("Should save the new user to the database", (done) => {
    signup(user)
      .then(() => {
        return User.findOne({ email: user.email });
      })
      .then((res) => {
        expect(res).toBeDefined();
        expect(res.email).toEqual(user.email);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it("Should return a promise with data that includes a token", (done) => {
    signup(user)
      .then((response: UserReturnType) => {
        expect(response.user.email).toEqual(user.email);
        expect(response.token).toBeDefined();
        done();
      })

      .catch((err) => {
        done(err);
      });
  });

  it("Should return a error for duplicate email entry", (done) => {
    insertUserDataToDb()
      .then(() => {
        return signup(user);
      })
      .catch((err) => {
        expect(err).toBeDefined();
        done();
      });
  });
});
