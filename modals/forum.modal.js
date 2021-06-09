const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forumSchema = new Schema(
  {
    forum_name: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    channels: {
      type: Array,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;
