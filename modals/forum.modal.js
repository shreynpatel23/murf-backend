const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumSchema = new Schema(
  {
    forumName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;
