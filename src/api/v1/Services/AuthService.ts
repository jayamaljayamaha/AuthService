import { BadRequestError, CustomError, NotFoundError } from "exception-library";
import Joi, { isError } from "joi";
import { AuthDataInterface, UserDocument } from "../DataTypes/Types";
import User from "../Models/User";
import { compare } from "./PasswordEncryptService";
import jwt from "jsonwebtoken";
import { UserReturnType } from "@randomn/drescode-common";

const jwtSecret = process.env.JWT_SECRET!;

export const validateAuthData = (data: any, schema: Joi.ObjectSchema) => {
  return schema.validate(data, { abortEarly: false });
};

export const auth = (data: AuthDataInterface) => {
  const { email, password } = data;
  const userReturn: UserReturnType = {
    id: "",
    email: "",
    token: "",
  };
  return new Promise((resolve, reject) => {
    User.find({ email: email })
      .then((user: UserDocument) => {
        if (!user) {
          throw new NotFoundError(`User by email: ${email} is not found`);
        }
        userReturn.id = user._id;
        userReturn.email = user.email;
        return compare(password, user.password);
      })
      .then((result: boolean) => {
        if (!result) {
          throw new BadRequestError("Invalid credentials");
        }
        const userJwt = jwt.sign(
          {
            id: userReturn.id,
            email: userReturn.email,
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
