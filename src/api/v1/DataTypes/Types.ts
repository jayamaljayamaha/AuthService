import mongoose from "mongoose";
export interface UserReturnType {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    role: string;
    email: string;
  };
  token: string;
}

export interface AuthDataInterface {
  email: string;
  password: string;
}

export interface UserDocument extends mongoose.Document {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  password: string;
}

export interface BlackListTokenDocument extends mongoose.Document {
  token: string;
}

export interface SignupDataInterface {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
