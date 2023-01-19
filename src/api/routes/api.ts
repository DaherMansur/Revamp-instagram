import {Request, Response, Router} from 'express'

//Middlewares
import { privateRoute, publicRoute } from '../middlewares/auth'
import {uploadFiles, uploadAvatar} from '../middlewares/multer'

//Validators
import { AuthValidator } from '../validators/AuthValidator'
import { ProfileValidator } from '../validators/ProfileValidator'

//Controllers
import * as authController from '../controllers/authController'
import * as profileController from '../controllers/profileController'
import * as postController from '../controllers/postController'
import * as searchController from '../controllers/searchController'

const router = Router()

router.get('/ping', (req:Request, res:Response) => {
   res.json({pong: true})
}) 

//Auth
router.post('/signup', AuthValidator.register, authController.signUp) //Register
router.post('/signin', AuthValidator.login, authController.signIn) //Login

//Profile - Account
router.get('/:username', publicRoute, profileController.getProfile)
router.post('/:username/follow', privateRoute, profileController.follow)

router.post('/accounts/edit', 
   privateRoute, //Middleware for Auth
   uploadAvatar, //Middeware Multer
   ProfileValidator.edit, //Validator
   profileController.edit // Controller
)

//Post
router.post('/post/create', privateRoute, uploadFiles, postController.createPost)
router.post('/post/edit/:id', privateRoute, uploadFiles, postController.editPost) //EDIT ROUTE
router.delete('/post/delmedia/:id', privateRoute, postController.deleteMedia) //Delete Media
router.put('/post/reorder/:id', privateRoute, postController.reOrderMedia)
router.get('/post/:id', postController.getPost)

//Search
router.get('/explore/:hashtag', searchController.searchHashtag)


export default router

