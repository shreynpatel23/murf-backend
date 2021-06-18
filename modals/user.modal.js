const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    forumId: {
      type: Schema.Types.ObjectId,
      ref: "Forum",
    },
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
    },
    imageUrl: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
