import express, {Request, Response, ErrorRequestHandler} from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

//Routes
import WebRoutes from './routes/web'

//Config
const app = express()

app.use(cors())
// app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({extended:true}))

//Routes
app.use('/', WebRoutes)

//Error Handler
// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//    let message = 'Não autorizado' //default
//    let status = 400 //default

//    if(err) message = err.message
//    if(err) status = err.status

//    res.status(status)
//    res.json({error :message})
// }

// //404 - NotFound
// app.use((req:Request, res:Response) => {
//    res.status(404);
//    res.json({error: 'EndPoint não encontrado'})
// })

// app.use(errorHandler)
app.listen(process.env.PORT_WEB)