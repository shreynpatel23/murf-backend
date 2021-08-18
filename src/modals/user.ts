import { Document, model, Types } from "mongoose";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    forumId: {
      type: Array,
    },
    name: {
      type: String,
      required: true,
      min: 6,
      max: 200,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 200,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export interface IUserSchema extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  forumId: Array<string>;
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  isEmailVerified: boolean;
  _doc: Document;
}

const User = model<IUserSchema>("User", userSchema);
export default User;
