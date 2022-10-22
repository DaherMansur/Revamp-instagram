import {Request, Response, Router} from 'express'

//Middlewares
import { privateRoute } from '../middlewares/auth'

//Validators
import { AuthValidator } from '../validators/AuthValidator'

//Controllers
import * as authController from '../controllers/authController'

const router = Router()

router.get('/ping', (req:Request, res:Response) => {
   res.json({pong: true})
}) 

router.post('/signup', AuthValidator.register, authController.signUp) //Register
router.post('/signin', AuthValidator.login, authController.signIn) //Login

export default router

