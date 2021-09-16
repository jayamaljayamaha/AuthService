import express from "express";
import currentUser from "../middlewares/CurrentUser";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "../Controllers/AuthController";
import { CheckAuth } from "@randomn/drescode-common";

const router = express.Router();

router.get("/currentuser", currentUser, CheckAuth, getCurrentUser);
router.post("/signin", signIn);
router.post("/signout", currentUser, CheckAuth, signOut);
router.post("/signup", signUp);

export default router;
