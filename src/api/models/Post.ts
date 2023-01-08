import {connection, Model, model, Schema, Types} from "mongoose";

interface Comments {
   idUser: Types.ObjectId,
   comment: string,
   like?:number,
   //date?
}

export interface Files{
   url: string,
   default: number
}

export interface Hashtag {
   name: string
}

export interface IPost  {
   profile: Types.ObjectId,
   caption?: string,
   hashtag?: Array<Hashtag>,
   createdAt?: Date,
   likes?: Types.ObjectId,
   comments?: Array<Comments>,
   files?: Array<Files>
}

const schema = new Schema<IPost>({
   profile: {type: Schema.Types.ObjectId, ref: 'Profile'},
   caption: {type: String, trim: true},
   hashtag: [{name: String}],
   createdAt: {type: Date, default: Date.now},
   likes: {type: Schema.Types.ObjectId, ref: 'Profile'},
   files: [{
      url: {type: String},
      default: {type: Number},
      _id: false
   }],
   comments: [{
      idUser: {type: Schema.Types.ObjectId, ref:'Profile'},
      comment: {type: String},
      like: {type: Number}
   }]
})

const modelName:string = 'Post'

export default (connection && connection.models[modelName]) ?
   connection.models[modelName] as Model<IPost>
   :
   model<IPost>(modelName, schema)

