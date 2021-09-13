import bcrypt from "bcrypt";

export const toHash = (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const compare = (suppliedPassword: string, hashPassword: string) => {
  return bcrypt.compare(suppliedPassword, hashPassword);
};
