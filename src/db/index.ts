import mongoose from "mongoose";

const mongoDB = `mongodb://memo:${process.env.DB_PASS}@83.229.127.48:27017/memo`;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
export default db;
