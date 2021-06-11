const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replies: {
    type: Array,
  },
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
