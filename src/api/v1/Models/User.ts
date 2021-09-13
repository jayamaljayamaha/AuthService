import mongoose from "mongoose";
import { UserDocument } from "../DataTypes/Types";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.set("versionKey", "version");

const User = mongoose.model<UserDocument, any>("User", userSchema);

export default User;
