import { Schema, model } from "mongoose";
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    admin: Boolean,
});
export const UserMongoose = model("User", userSchema);
