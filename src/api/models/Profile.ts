import {Schema, model, Model, Types, connection} from "mongoose";

export enum EFollow {
   Follow = 'follow',
   Unfollow = 'unfollow'
}

interface Photo{
   url: string
}

interface Follow {
   idProfile: Types.ObjectId, //idProfile?
   follow?: EFollow
}

export interface IProfile {
   user: Types.ObjectId,
   bio?: string,
   name?: string,
   pubs?: Types.ObjectId, //or Number
   website?: string,
   celphone?: number,
   gender?: string,
   photo?: Types.DocumentArray<Photo>
   following?: Array<Follow> 
   followers?: Array<Follow>
}

const schema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User'},
   bio: {type:String},
   name: {type:String}, 
   pubs: {type:Schema.Types.ObjectId, ref: 'Posts'},
   website: {type:String},
   celphone: {type: Number},
   gender: {type:String},
   photo: [{url:String}],
   following: [{
      idProfile: {type: Schema.Types.ObjectId, ref: 'Profile'},
      follow: {
         type:String,
         enum: EFollow,
         default: 'unfollow'
      }
   }]
})

const modelName:string = 'Profile'

export default (connection && connection.models[modelName]) ?
   connection.models[modelName] as Model<IProfile>
   :
   model<IProfile>(modelName, schema)
