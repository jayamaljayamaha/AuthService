import {
  CurrentUserPayloadType,
  JwtPayloadType,
} from "@randomn/drescode-common";
import { UnorthorizedError } from "exception-library";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BlackListTokenDocument } from "../DataTypes/Types";
import BlackListToken from "../Models/BlackListTokens";

const jwtSecret = process.env.JWT_SECRET!;

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] != "Bearer"
  ) {
    return next();
  }
  const token = req.headers.authorization.split(" ")[1];
  BlackListToken.findOne({ token })
    .then((blackListToken: BlackListTokenDocument) => {
      if (blackListToken) {
        return next();
      }

      try {
        const payload = jwt.verify(token, jwtSecret) as JwtPayloadType;
        req.currentUser = {
          user: payload,
          token: token,
        };
        return next();
      } catch (err: any) {
        throw new UnorthorizedError(err.message);
      }
    })
    .catch((err: Error) => {
      next(err);
    });
};

export default currentUser;
