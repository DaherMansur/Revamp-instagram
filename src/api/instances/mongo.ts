import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

// A opção strictQuery controla se consultas que usam operadores inválidos (por exemplo, $abc) 
// geram erros no Mongoose. 
// Quando strictQuery é definido como true, 
// o Mongoose lança um erro quando a consulta contém operadores inválidos. 
// Quando strictQuery é definido como false, o Mongoose ignora operadores inválidos.
// O aviso indica que a opção strictQuery do Mongoose será alterada de volta para false 
// por padrão na próxima versão principal do Mongoose 
mongoose.set('strictQuery', false);

export const MongoConnect = () => {
   try {
      console.log('__ Connecting to MongoDB... __')
      mongoose.connect(process.env.MONGODB_URL as string)
      console.log('__ MongoDB connected __')

   } catch (error) {
      console.log('Erro:  => ' + error)
   }
}