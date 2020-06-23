const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 200,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 200,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1200,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("user", UserSchema);
module.exports = User;
