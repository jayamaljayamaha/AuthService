import mongoose from "mongoose";
import app from "./api/v1/app";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
if (!process.env.DB_URI) {
  throw new Error("DB_URI is not defined");
}
if (!process.env.DB_NAME) {
  throw new Error("DB_NAME is not defined");
}
if (!process.env.DB_PORT) {
  throw new Error("DB_PORT is not defined");
}
if (!process.env.SERVER_PORT) {
  throw new Error("SERVER_PORT is not defined");
}
mongoose
  .connect(
    `mongodb://${process.env.DB_URI}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  )
  .then((data) => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Auth server is listning on port ${process.env.SERVER_PORT}`);
});
