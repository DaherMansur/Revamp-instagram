import {Model, Schema, model, connection} from "mongoose"

interface IUser {
   email: string,
   password: string
}

const schema = new Schema<IUser>({
   email: {type:String, required:true, unique:true},
   password: {type:String, required:true, minlength:8}
})

const modelName:string = 'User'

export default (connection && connection.models[modelName]) ?
   connection.models[modelName] as Model<IUser>
   :
   model<IUser>(modelName, schema)