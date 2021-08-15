import { Document, Types, model } from "mongoose";
import mongoose from "mongoose";
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

export interface IPostSchema extends Document {
  forumId: Types.ObjectId;
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
  liked: Liked;
  headerText: string;
  headerHTML: string;
  bodyText: string;
  bodyHTML: string;
  tags: Array<string>;
  comments: Array<string | Types.ObjectId>;
  pinned: boolean;
  saved: boolean;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _doc: Document;
}

interface Liked {
  count: number;
  isLiked: boolean;
}

const Post = model<IPostSchema>("Post", postSchema);
export default Post;
