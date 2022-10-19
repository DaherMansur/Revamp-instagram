import {Request, Response, Router} from 'express'

//Controllers
import * as authController from '../controllers/authController'

const router = Router()

router.get('/ping', (req:Request, res:Response) => {
   res.json({pong: true})
}) 

router.post('/signup', authController.signUp)

export default router

