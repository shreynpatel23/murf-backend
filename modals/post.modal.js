const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    forumId: {
      type: Schema.Types.ObjectId,
      ref: "Forum",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    liked: {
      count: Number,
      isLiked: Boolean,
    },
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
      ref: "User",
    },
    pinned: {
      type: Boolean,
    },
    saved: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
