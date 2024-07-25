import mongoose from "mongoose";
import db from "@/db";

delete mongoose.models["user"];
const UserModelSchema = new mongoose.Schema({
  username: String,
  password: String,
  create_time: { type: Date, default: Date.now },
});

const UserModel = db.model("user", UserModelSchema);
export default UserModel;
