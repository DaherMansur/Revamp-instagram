import express, {Request, Response, ErrorRequestHandler} from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

//Database
import { MongoConnect } from './instances/mongo'

//Routes
import ApiRoutes from './routes/api'

//Config
const app = express()
MongoConnect() //Database

app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({extended:true}))

//Routes
app.use('/api', ApiRoutes)

//400 - BadRequest
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
   res.status(400)
   res.json({status: 'Não autorizado'})

   if(err.status) res.status(err.status)
   if(err.message) res.json({status: err.message})
}

//404 - NotFound
app.use((req:Request, res:Response) => {
   res.status(404);
   res.json({error: 'EndPoint não encontrado'})
})

app.use(errorHandler)
app.listen(process.env.PORT)