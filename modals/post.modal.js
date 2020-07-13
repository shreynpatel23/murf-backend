const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    headerText: {
      type: String,
    },
    bodyText: {
      type: String,
    },
    tags: {
      type: Array,
    },
    category: {
      type: String,
    },
    comments: {
      type: Array,
    },
    postedBy: {
      type: String,
    },
    pinned: {
      type: Boolean,
    },
    saved: {
      type: Boolean,
    },
    liked: {
      type: Boolean,
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

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
