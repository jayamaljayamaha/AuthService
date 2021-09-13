import mongoose from "mongoose";
export interface UserReturnType {
  id: string;
  email: string;
  token: string;
}

export interface AuthDataInterface {
  email: string;
  password: string;
}

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}
