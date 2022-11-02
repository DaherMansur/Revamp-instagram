import {Request, Response, Router} from 'express'

//Middlewares
import { privateRoute } from '../middlewares/auth'
import { uploadPhoto } from '../middlewares/multer'

//Validators
import { AuthValidator } from '../validators/AuthValidator'
import { ProfileValidator } from '../validators/ProfileValidator'

//Controllers
import * as authController from '../controllers/authController'
import * as profileController from '../controllers/profileController'

const router = Router()

router.get('/ping', (req:Request, res:Response) => {
   res.json({pong: true})
}) 

//Auth
router.post('/signup', AuthValidator.register, authController.signUp) //Register
router.post('/signin', AuthValidator.login, authController.signIn) //Login

//Profile - Account
router.get('/:username', privateRoute, profileController.getProfile)

router.post('/accounts/edit', 
   privateRoute, //Middleware for Auth
   uploadPhoto.single('photo'), //Middeware Multer
   ProfileValidator.edit, //Validator
   profileController.edit // Controller
)



export default router

