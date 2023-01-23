import {connection, Model, model, Schema, Types} from "mongoose";

interface Comments {
   idUser: Types.ObjectId,
   comment: string,
   //like?:number,
   date?: Date,
   reply?: Array<Comments>
}

export interface Files{
   url: string
}

export interface Hashtag {
   name: string
}

export interface Likes {
   user: Types.ObjectId
}

export interface IPost  {
   profile: Types.ObjectId,
   caption?: string,
   hashtag?: Array<Hashtag>,
   createdAt?: Date,
   likes?: Array<Likes>,
   comments?: Array<Comments>,
   files?: Array<Files>
}

const schema = new Schema<IPost>({
   profile: {type: Schema.Types.ObjectId, ref: 'Profile'},
   caption: {type: String, trim: true},
   hashtag: [{name: String}],
   createdAt: {type: Date, default: Date.now},
   likes: [{
      user: {type: Schema.Types.ObjectId, ref: 'Profile'},
      _id: false
   }],
   files: [{
      url: {type: String},
      _id: false
   }],
   comments: [{
      idUser: {type: Schema.Types.ObjectId, ref:'Profile'},
      comment: {type: String},
      date: {type: Date, default: Date.now},
      reply: [{
         idUser: {type: Schema.Types.ObjectId, ref:'Profile'},
         comment: {type: String},
         date: {type: Date, default: Date.now}
      }]
      //like: {type: Number}
   }]
})

const modelName:string = 'Post'

export default (connection && connection.models[modelName]) ?
   connection.models[modelName] as Model<IPost>
   :
   model<IPost>(modelName, schema)

