import {Model, Document, Schema, model, connection} from "mongoose"

export interface IUser {
   email: string,
   password: string,
   username: string
}

export interface UserDocument extends Document, IUser {}

const schema = new Schema<IUser>({
   email: {type:String, required:true, unique:true},
   username: {type:String, required:true, unique:true},
   password: {type:String, required:true, minlength:6}
})

const modelName:string = 'User'

const User: Model<UserDocument> =
   (connection && connection.models[modelName]) ||
   model<UserDocument>(modelName, schema)

export default User