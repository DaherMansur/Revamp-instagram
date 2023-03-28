import { Document, Model, model, Schema, Types, connection } from "mongoose";

interface Comments {
  idComment: Types.ObjectId;
}

export interface Files {
  url: string;
}

export interface Hashtag {
  name: string;
}

export interface Likes {
  user: Types.ObjectId;
}

export interface IPost {
  profile: Types.ObjectId;
  caption?: string;
  hashtag?: Array<Hashtag>;
  createdAt?: Date;
  likes?: Array<Likes>;
  comments?: Array<Comments>;
  files?: Array<Files>;
}

export interface PostDocument extends Document, IPost {}

const schema = new Schema<IPost>({
  profile: { type: Schema.Types.ObjectId, ref: "Profile" },
  caption: { type: String, trim: true },
  hashtag: [{ name: String }],
  createdAt: { type: Date, default: Date.now },
  likes: [
    {
      user: { type: Schema.Types.ObjectId, ref: "Profile" },
      _id: false,
    },
  ],
  files: [
    {
      url: { type: String },
      _id: false,
    },
  ],
  comments: [
    {
      idComment: { type: Schema.Types.ObjectId, ref: "Comment" },
      _id: false,
    },
  ],
});

const modelName: string = "Post";

const Post: Model<PostDocument> =
  (connection && connection.models[modelName]) ||
  model<PostDocument>(modelName, schema);

export default Post;