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
    channelId: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    liked: {
      count: Number,
      isLiked: Boolean,
    },
    headerText: {
      type: String,
    },
    headerHTML: {
      type: String,
    },
    bodyText: {
      type: String,
    },
    bodyHTML: {
      type: String,
    },
    tags: {
      type: Array,
    },
    comments: {
      type: Array,
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
