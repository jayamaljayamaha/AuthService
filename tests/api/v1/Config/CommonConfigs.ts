import mongoose from "mongoose";
import User from "../../../../src/api/v1/Models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "../../../../src/api/v1/DataTypes/Enums";
const jwtSecret = process.env.JWT_SECRET!;

export const clearDb = () => {
  return mongoose.connection.db.collections().then((collections) => {
    return new Promise<void>((resolve, reject) => {
      collections.forEach((collection) => {
        collection.deleteMany({}).catch((err) => {
          reject(err);
        });
      });
      resolve();
    });
  });
};

export const insertUserDataToDb = () => {
  const user = {
    firstname: "jayamal",
    lastname: "jayamaha",
    email: "jayamaljayamaha2@gmail.com",
    password: "abcd1234",
  };
  return bcrypt.hash(user.password, 10).then((encryptedPass) => {
    user.password = encryptedPass;
    return User.insertMany([user]);
  });
};

export const reciveDummyToken = () => {
  const user = {
    firstname: "jayamal",
    lastname: "jayamaha",
    email: "jayamaljayamaha2@gmail.com",
    password: "abcd1234",
  };
  const userJwt = jwt.sign(
    {
      id: "asds223ad",
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: Role.USER,
    },
    jwtSecret,
    {
      expiresIn: 60 * 30,
    }
  );
  return userJwt;
};
