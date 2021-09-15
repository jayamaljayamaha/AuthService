import mongoose from "mongoose";
import { BlackListTokenDocument } from "../DataTypes/Types";

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const BlackListToken = mongoose.model<BlackListTokenDocument, any>(
  "BlackListToken",
  blackListTokenSchema
);

export default BlackListToken;
