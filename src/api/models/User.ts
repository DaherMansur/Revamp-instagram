import {Model, Schema, model, connection} from "mongoose"

export interface IUser {
   email: string,
   password: string,
   username: string
}

const schema = new Schema<IUser>({
   email: {type:String, required:true, unique:true},
   username: {type:String, required:true, unique:true},
   password: {type:String, required:true, minlength:6}
})

const modelName:string = 'User'

export default (connection && connection.models[modelName]) ?
   connection.models[modelName] as Model<IUser>
   :
   model<IUser>(modelName, schema)