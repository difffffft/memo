import mongoose from "mongoose";
import db from "@/db";

delete mongoose.models["user"];
const UserModelSchema = new mongoose.Schema({
  username: String,
  password: String,
  create_time: { type: Date, default: Date.now },
});
export const UserModel = db.model("user", UserModelSchema);

delete mongoose.models["word"];
const WordModelSchema = new mongoose.Schema({
  word: String,
  desc: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  create_time: { type: Date, default: Date.now },
});
export const WordModel = db.model("word", WordModelSchema);
