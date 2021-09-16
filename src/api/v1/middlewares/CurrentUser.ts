import {
  CurrentUserPayloadType,
  JwtPayloadType,
} from "@randomn/drescode-common";
import { UnorthorizedError } from "exception-library";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../Config/Logger";
import { BlackListTokenDocument } from "../DataTypes/Types";
import BlackListToken from "../Models/BlackListTokens";

const jwtSecret = process.env.JWT_SECRET!;

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Validating the token and getting the current user");
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] != "Bearer"
  ) {
    logger.error("No authorization header in the request");
    return next();
  }
  logger.error("Get the token from authorization header");
  const token = req.headers.authorization.split(" ")[1];
  logger.error("Check the token exists in BlackListToken schema");
  BlackListToken.findOne({ token })
    .then((blackListToken: BlackListTokenDocument) => {
      if (blackListToken) {
        logger.error("Token exists in BlackListToken schema");
        return next();
      }
      logger.error("token doesn't exists in BlackListToken schema");
      try {
        logger.error("Validate the token");
        const payload = jwt.verify(token, jwtSecret) as JwtPayloadType;
        req.currentUser = {
          user: payload,
          token: token,
        };
        logger.error("Token is valid get data from token");
        return next();
      } catch (err: any) {
        logger.error("Token is invalid");
        throw new UnorthorizedError(err.message);
      }
    })
    .catch((err: Error) => {
      next(err);
    });
};

export default currentUser;
