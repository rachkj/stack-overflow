const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: Number, required: true },
  impressions:{type: Number, required: true }
}, { collection: "User" }); 



module.exports = UserSchema;
