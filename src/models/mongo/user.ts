import { Schema, model } from "mongoose";
import { User } from "../../types/spot-types.js";

const userSchema = new Schema<User>({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  admin: Boolean,
});

export const UserMongoose = model("User", userSchema);