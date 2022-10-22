import {Request, Response} from 'express'
import { generateToken } from '../middlewares/auth'
import {validationResult, matchedData} from 'express-validator'
import bcrypt from 'bcrypt'

//models
import User from '../models/User'
import Profile from '../models/Profile'

export const signUp = async(req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()})

   const data = matchedData(req)

   //Basic verification for username and email
   const username = await User.findOne({username: data?.username})
   const email = await User.findOne({email: data?.email})

   if(email || username) {
      return res.json({error: 'Email ou nome de usuário já existe'})
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

   res.json({status: token})
}

export const signIn = async (req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()})

   const data = matchedData(req)

   //If Email already exists...
   const user = await User.findOne({email: data?.email})
   if(!user) return res.json({error: 'Email ou senha errados'})

   //If Password is wrong...
   const passMatch = bcrypt.compareSync(data?.password, user?.password)
   if(!passMatch) return res.json({error: 'Email ou senha errados'})

   const token = generateToken(user?.id)

   res.json({status:token})
}