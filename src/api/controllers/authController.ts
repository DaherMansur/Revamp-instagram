import {Request, Response} from 'express'
import { generateToken } from '../middlewares/auth'
import {validationResult, matchedData} from 'express-validator'
import bcrypt from 'bcrypt'

//models
import User from '../models/User'

export const signUp = async(req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()})

   const data = matchedData(req)

   const user = await User.findOne({email: data.email})
   if(user) return res.json({error: {email:{msg: 'Email já existe'}}})

   //Password Hash
   const hashPassword = bcrypt.hashSync(data?.password, 10) 

   const newUser = new User()
   newUser.email = data?.email
   newUser.password = hashPassword
   await newUser.save()

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