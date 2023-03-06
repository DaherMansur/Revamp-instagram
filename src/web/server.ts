import express, {Request, Response} from 'express'
import path from 'path'
import dotenv from 'dotenv'
import mustacheExpress from 'mustache-express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

//Routes
import WebRoutes from './routes/web'

//Config
const app = express()

app.use(cookieParser())

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({extended:true}))

//Routes
app.use('/', WebRoutes)

//404 - NotFound
app.use((req:Request, res:Response) => {
   res.status(404);
   res.render('404')
})

app.listen(process.env.PORT_WEB)