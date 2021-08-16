import { Document, model, Types } from "mongoose";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // forumId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Forum",
    // },
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
  // forumId: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  isEmailVerified: boolean;
  _doc: Document;
}

const User = model<IUserSchema>("User", userSchema);
export default User;
