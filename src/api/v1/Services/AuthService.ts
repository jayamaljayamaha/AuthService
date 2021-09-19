import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "exception-library";
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
import logger from "../Config/Logger";

const jwtSecret = process.env.JWT_SECRET!;

export const validateAuthData = (data: any, schema: Joi.ObjectSchema) => {
  return schema.validate(data, { abortEarly: false });
};

export const auth = (data: AuthDataInterface) => {
  logger.info("Get email and password from AuthDataInterface data");
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
        logger.info("Getting user by email from database");
        if (!user) {
          logger.error(`User not found for email ${email}`);
          throw new NotFoundError(`User by email: ${email} is not found`);
        }
        userReturn.user.id = user._id;
        userReturn.user.firstname = user.firstname;
        userReturn.user.lastname = user.lastname;
        userReturn.user.role = user.role;
        userReturn.user.email = user.email;
        logger.info(`User found for email ${email}`);
        return compare(password, user.password);
      })
      .then((result: boolean) => {
        if (!result) {
          logger.error("password is invalid");
          throw new BadRequestError("Invalid credentials");
        }
        logger.info("Password validation success");
        logger.info("Creating JWT token");
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
        logger.info("JWT token created");
        userReturn.token = userJwt;
        resolve(userReturn);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const invalidateToken = (token: string) => {
  logger.info("Invalidating the token");
  const blackToken = new BlackListTokens({ token: token });
  logger.info("Save token to BlackListToken schema");
  return blackToken.save();
};

export const signup = (data: SignupDataInterface) => {
  return new Promise((resolve, reject) => {
    logger.info("Encrypting the password");
    toHash(data.password)
      .then((encryptedPassword) => {
        logger.info("Password encrypted");
        data.password = encryptedPassword;
        const user = new User(data);
        logger.info("Saving the new user details to the database");
        return user.save();
      })
      .then((user: UserDocument) => {
        logger.info("User saved successfully");
        logger.info("Creating JWT token");
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
        logger.info("JWT token created");
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
        reject(new InternalServerError(err.message));
      });
  });
};
