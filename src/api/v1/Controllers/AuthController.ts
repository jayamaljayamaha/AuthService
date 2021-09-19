import { CurrentUserPayloadType } from "@randomn/drescode-common";
import { DataValidationError, ValidationErrorType } from "exception-library";
import { Request, Response, NextFunction } from "express";
import logger from "../Config/Logger";
import {
  AuthDataInterface,
  SignupDataInterface,
  UserDocument,
} from "../DataTypes/Types";
import {
  auth,
  invalidateToken,
  signup,
  validateAuthData,
} from "../Services/AuthService";
import UserSigninSchema from "../ValidationSchemas/UserSigninSchema";
import UserSignupSchema from "../ValidationSchemas/UserSignupSchema";

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).send({ currentUser: req.currentUser });
};

export const signIn = (req: Request, res: Response, next: NextFunction) => {
  logger.info("get a request to signin user");
  const body: AuthDataInterface = req.body;
  logger.info("Validating body");
  const { error } = validateAuthData(body, UserSigninSchema);

  if (error) {
    logger.error(`Invalid data in body: ${error}`);
    const errors: ValidationErrorType[] = error.details.map((detail) => {
      const err: ValidationErrorType = {
        message: detail.message,
        field: detail.context?.label,
        errorType: detail.type,
      };
      return err;
    });
    throw new DataValidationError(errors);
  }
  logger.info("Data validated successfully");
  auth(body)
    .then((data) => {
      logger.info(`User authenticated successfully: ${JSON.stringify(data)}`);
      res.status(200).send(data);
    })
    .catch((err) => {
      logger.error(`Exception happened when authenticating user: ${err}`);
      next(err);
    });
};

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  logger.info("get a request to signout already signin user");
  const payLoad: CurrentUserPayloadType = req.currentUser!;
  invalidateToken(payLoad.token)
    .then(() => {
      logger.info(`User ${payLoad.user.email} signed out successfully`);
      res.status(200).send({ user: payLoad.user, status: "signed-out" });
    })
    .catch((err: Error) => {
      logger.error(
        `Exception happened when signing out User ${payLoad.user.email}`
      );
      next(err);
    });
};

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  logger.info("get a request to signup user");
  const body: SignupDataInterface = req.body;
  logger.info("Validating body");
  const { error } = validateAuthData(body, UserSignupSchema);
  if (error) {
    logger.error(`Invalid data in body: ${error}`);
    const errors: ValidationErrorType[] = error.details.map((detail) => {
      const err: ValidationErrorType = {
        message: detail.message,
        field: detail.context?.label,
        errorType: detail.type,
      };
      return err;
    });
    throw new DataValidationError(errors);
  }
  logger.info("Data validated successfully");
  signup(body)
    .then((response) => {
      logger.info(`User signed up successfully: ${JSON.stringify(response)}`);
      res.status(201).send(response);
    })
    .catch((err) => {
      logger.info(`Exception happened when signup user ${err}`);
      next(err);
    });
};
