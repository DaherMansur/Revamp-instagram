import {Schema, Document, model, Model, Types, connection} from "mongoose";

export interface Photo{
   url: string
}

export interface Follow {
   idProfile?: Types.ObjectId, //idProfile?
}

export interface IProfile {
   user?: Types.ObjectId,
   bio?: string,
   name?: string,
   pubs?: Types.ObjectId, //or Number
   website?: string,
   celphone?: string,
   gender?: string,
   photo?: Array<Photo>
   following?: Array<Follow> 
   followers?: Array<Follow>
}

export interface ProfileDocument extends Document, IProfile {}

const schema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User'},
   bio: {type:String, maxlength: 150},
   name: {type:String}, 
   pubs: {type:Schema.Types.ObjectId, ref: 'Posts'},
   website: {type:String},
   celphone: {type: String},
   gender: {type:String},
   photo: [{url:String, _id:false}],
   following: [{
      idProfile: {type: Schema.Types.ObjectId, ref: 'Profile'},
      _id:false
   }],
   followers: [{
      idProfile: {type: Schema.Types.ObjectId, ref: 'Profile'},
      _id:false
   }]
})

const modelName:string = 'Profile'

const Profile: Model<ProfileDocument> = 
   (connection && connection.models[modelName]) ||
   model<ProfileDocument>(modelName, schema)

export default Profile;