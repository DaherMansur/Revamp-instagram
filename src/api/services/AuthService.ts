import { generateToken } from '../middlewares/auth'
import bcrypt from 'bcrypt'

//models
import User, {IUser} from '../models/User'
import Profile from '../models/Profile'

export const createUser = async(data:IUser): Promise<Error | string> => {   

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

export const login = async(email:string, password:string): Promise<Error | string> => {

   const user = await User.findOne({email})
   if(!user) return new Error('Email ou senha errados')

   //If Password is wrong...
   const passMatch = bcrypt.compareSync(password, user?.password)
   if(!passMatch) return new Error('Email ou senha errados')

   const token = generateToken(user?.id)

   return token
}