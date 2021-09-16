import bcrypt from "bcrypt";
import logger from "../Config/Logger";

export const toHash = (password: string) => {
  logger.info("Creating hash password");
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const compare = (suppliedPassword: string, hashPassword: string) => {
  logger.info("Validate the user password");
  return bcrypt.compare(suppliedPassword, hashPassword);
};
