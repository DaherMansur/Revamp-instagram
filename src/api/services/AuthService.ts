import { generateToken } from '../middlewares/auth'
import bcrypt from 'bcrypt'

//models
import User, {IUser} from '../models/User'
import Profile from '../models/Profile'


export const createUser = async(data:IUser)  => {   

   const username = await User.findOne({username: data?.username})
   const email = await User.findOne({email: data?.email})

   if(email || username) {
      return new Error('Email ou nome de usuário já existe')
   }

   //Password Hash
   const hashPassword = bcrypt.hashSync(data?.password, 10) 

   const newUser = new User()
   newUser.username = data?.username
   newUser.email = data?.email
   newUser.password = hashPassword
   await newUser.save()

   //create a Profile for the User.
   const newProfile = new Profile()
   newProfile.user = newUser?.id
   await newProfile.save()

   const token = generateToken({_id: newUser?.id})

   return token
}