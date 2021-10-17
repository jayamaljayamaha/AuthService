import mongoose from "mongoose";
import app from "./api/v1/app";
import logger from "./api/v1/Config/Logger";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
if (!process.env.DB_URI) {
  throw new Error("DB_URI is not defined");
}
if (!process.env.DB_NAME) {
  throw new Error("DB_NAME is not defined");
}
if (!process.env.DB_USER) {
  throw new Error("DB_USER is not defined in env variables");
}
if (!process.env.DB_PASSWORD) {
  throw new Error("DB_PASSWORD is not defined in env variables");
}
if (!process.env.SERVER_PORT) {
  throw new Error("SERVER_PORT is not defined");
}
if (!process.env.LOG_FILE_PATH) {
  throw new Error("LOG_FILE_PATH is not defined in env variables");
}

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then((data) => {
    logger.info("Connected to database");
  })
  .catch((err) => {
    logger.error(err.message);
  });

app.listen(process.env.SERVER_PORT, () => {
  logger.info(`Auth service is listning on port ${process.env.SERVER_PORT}`);
});
