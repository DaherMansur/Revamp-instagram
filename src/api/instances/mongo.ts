import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

export const MongoConnect = () => {
   try {
      console.log('__ Connecting to MongoDB... __')
      mongoose.connect(process.env.MONGODB_URL as string)
      console.log('__ MongoDB connected __')

   } catch (error) {
      console.log('Erro:  => ' + error)
   }
}