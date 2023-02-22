import {connection, Document, Model, model, Schema, Types} from "mongoose";

export interface IComment {
  idUser: Types.ObjectId;
  comment: string;
  date: Date;
  reply?: Array<Reply>;
  depth: number;
  maxDepth: number;
}

interface Reply extends IComment{
  id:Types.ObjectId
}

export interface CommentDocument extends Document, IComment {}

const schema = new Schema<IComment>({
  idUser: { type: Schema.Types.ObjectId, ref: "Profile" },
  comment: { type: String },
  date: { type: Date, default: Date.now },
  reply: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Comment" },
      _id: false,
    },
  ],
  depth: { type: Number, default: 0 },
  maxDepth: { type: Number, default: 2 },
});

export const modelName:string = 'Comment'

const Comment: Model<CommentDocument> =
   (connection && connection.models[modelName]) ||
   model<CommentDocument>(modelName, schema)

export default Comment