import express from "express";
import "express-async-errors";
import cors from "cors";
import AuthRouter from "./Routes/Auth";
import { ExceptionHandler } from "exception-library";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", AuthRouter);

app.use(ExceptionHandler);

export default app;
