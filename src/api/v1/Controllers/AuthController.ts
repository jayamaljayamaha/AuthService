import { CurrentUserPayloadType } from "@randomn/drescode-common";
import { DataValidationError, ValidationErrorType } from "exception-library";
import { Request, Response, NextFunction } from "express";
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
  const body: AuthDataInterface = req.body;
  const { error } = validateAuthData(body, UserSigninSchema);

  if (error) {
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

  auth(body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

export const signOut = (req: Request, res: Response, next: NextFunction) => {
  const payLoad: CurrentUserPayloadType = req.currentUser!;
  invalidateToken(payLoad.token)
    .then(() => {
      return res.status(200).send({ user: payLoad.user, status: "signed-out" });
    })
    .catch((err: Error) => {
      next(err);
    });
};

export const signUp = (req: Request, res: Response, next: NextFunction) => {
  const body: SignupDataInterface = req.body;
  const { error } = validateAuthData(body, UserSignupSchema);
  if (error) {
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

  signup(body)
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
};
