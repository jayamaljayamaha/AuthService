import { BadRequestError, NotFoundError } from "exception-library";
import Joi, { isError } from "joi";
import {
  AuthDataInterface,
  SignupDataInterface,
  UserDocument,
  UserReturnType,
} from "../DataTypes/Types";
import User from "../Models/User";
import { compare, toHash } from "./PasswordEncryptService";
import jwt from "jsonwebtoken";
import BlackListTokens from "../Models/BlackListTokens";

const jwtSecret = process.env.JWT_SECRET!;

export const validateAuthData = (data: any, schema: Joi.ObjectSchema) => {
  return schema.validate(data, { abortEarly: false });
};

export const auth = (data: AuthDataInterface) => {
  const { email, password } = data;
  const userReturn: UserReturnType = {
    user: {
      id: "",
      firstname: "",
      lastname: "",
      email: "",
      role: "",
    },
    token: "",
  };
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then((user: UserDocument) => {
        if (!user) {
          throw new NotFoundError(`User by email: ${email} is not found`);
        }
        userReturn.user.id = user._id;
        userReturn.user.firstname = user.firstname;
        userReturn.user.lastname = user.lastname;
        userReturn.user.role = user.role;
        userReturn.user.email = user.email;

        return compare(password, user.password);
      })
      .then((result: boolean) => {
        if (!result) {
          throw new BadRequestError("Invalid credentials");
        }
        const userJwt = jwt.sign(
          {
            id: userReturn.user.id,
            firstname: userReturn.user.firstname,
            lastname: userReturn.user.lastname,
            email: userReturn.user.email,
            role: userReturn.user.role,
          },
          jwtSecret,
          {
            expiresIn: 60 * 30,
          }
        );
        userReturn.token = userJwt;
        resolve(userReturn);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const invalidateToken = (token: string) => {
  const blackToken = new BlackListTokens(token);
  return blackToken.save();
};

export const signup = (data: SignupDataInterface) => {
  return new Promise((resolve, reject) => {
    toHash(data.password)
      .then((encryptedPassword) => {
        data.password = encryptedPassword;
        const user = new User(data);
        return user.save();
      })
      .then((user: UserDocument) => {
        const userJwt = jwt.sign(
          {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
          },
          jwtSecret,
          {
            expiresIn: 60 * 30,
          }
        );
        const userReturn: UserReturnType = {
          user: {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
          },
          token: userJwt,
        };
        resolve(userReturn);
      })
      .catch((err: Error) => {
        resolve(err);
      });
  });
};
