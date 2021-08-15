import { Document, model, Types } from "mongoose";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const channelSchema = new Schema({
  channel_name: {
    type: String,
    required: true,
  },
  forumId: {
    type: Schema.Types.ObjectId,
    ref: "Forum",
    required: true,
  },
  postIds: {
    type: Array,
  },
});

export interface IChannelSchema extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _doc: Document;
  channel_name: string;
  forumId: Types.ObjectId;
  postIds: Array<Types.ObjectId>;
}

const Channel = model<IChannelSchema>("Channel", channelSchema);
export default Channel;
