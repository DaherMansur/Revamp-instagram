import {Request, Response, Router} from 'express'

//Controllers
import * as TestController from '../controllers/test'

const router = Router()

router.get('/ping', (req:Request, res:Response) => {
   res.json({pong: true})
}) 

router.post('/test', TestController.populate)

export default router

