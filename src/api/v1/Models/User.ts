import mongoose from "mongoose";
import { Role } from "../DataTypes/Enums";
import { UserDocument } from "../DataTypes/Types";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Role,
    default: Role.USER,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.set("versionKey", "version");

const User = mongoose.model<UserDocument, any>("User", userSchema);

User.createIndexes();

export default User;
