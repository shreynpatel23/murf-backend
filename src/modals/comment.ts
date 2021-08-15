import { Document, model, Types } from "mongoose";
import mongoose from "mongoose";

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

export interface ICommentSchema extends Document {
  postId: Types.ObjectId;
  comment: string;
  replies: Array<string>;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _doc: Document;
}

const Comment = model<ICommentSchema>("Comment", CommentSchema);
export default Comment;
