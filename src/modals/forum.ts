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
    createdBy: {
      required: true,
      type: {
        name: String,
        email: String,
        Id: Types.ObjectId,
      },
    },
    users: {
      type: Array,
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
  users: Array<ICreatedBy>;
  createdBy: ICreatedBy;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  _doc: Document;
}

export interface ICreatedBy {
  name: string;
  email: string;
  Id: Types.ObjectId;
}

const Forum = model<IForumSchema>("Forum", forumSchema);
export default Forum;
