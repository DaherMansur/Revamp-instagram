import {Router} from 'express'

//controllers
import * as AuthController from '../controllers/authController'

//middlewares
import { privateRoute } from '../middlewares/auth'

const router = Router()

router.get('/', AuthController.index)
router.post('/login', AuthController.login)
router.get('/teste', privateRoute, AuthController.teste)
//router.post('/logout', AuthController.logout)


export default router