import { Document, Types, model } from "mongoose";
import mongoose from "mongoose";
import { IChannelSchema } from "./channel";

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

export interface IForumSchema extends Document {
  forum_name: string;
  theme: string;
  channels: Array<IChannelSchema>;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  _doc: Document;
}

const Forum = model<IForumSchema>("Forum", forumSchema);
export default Forum;
