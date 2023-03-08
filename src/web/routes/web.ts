import {Router} from 'express'

//controllers
import * as AuthController from '../controllers/authController'

//middlewares
import { privateRoute, logoutRoute } from '../middlewares/auth'

const router = Router()

router.get('/', privateRoute, AuthController.index)
router.post('/login', privateRoute, AuthController.login)
router.get('/teste', privateRoute, AuthController.teste)
router.post('/logout', logoutRoute, AuthController.logout)
//router.post('/logout', AuthController.logout)


export default router