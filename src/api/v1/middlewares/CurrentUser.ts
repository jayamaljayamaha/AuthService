import {
  CurrentUserPayloadType,
  JwtPayloadType,
} from "@randomn/drescode-common";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import BlackListToken from "../Models/BlackListTokens";

const jwtSecret = process.env.JWT_SECRET!;

// declare global {
//     namespace Express {
//         interface Request {
//             currentUser?: CurrentUserPayloadType
//         }
//     }
// }

const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] != "Bearer"
  ) {
    return next();
  }
  const token = req.headers.authorization.split(" ")[1];
  BlackListToken.findOne({ token }).then((blackListToken) => {
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
    } catch (err) {
      console.log(err);
      return next(err);
    }
  });
};

export default currentUser;
