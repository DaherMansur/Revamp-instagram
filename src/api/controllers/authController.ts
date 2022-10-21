import {Request, Response} from 'express'
import { generateToken } from '../middlewares/auth'
import {validationResult, matchedData} from 'express-validator'

//models
import User from '../models/User'

export const signUp = async(req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.mapped()})
   }

   const data = matchedData(req)

   const user = await User.findOne({email: data.email})
   if(user) return res.json({error: {email:{msg: 'Email já existe'}}})

   const newUser = new User()
   newUser.email = data?.email
   newUser.password = data?.password
   await newUser.save()

   const token = generateToken({_id: newUser?.id})

   res.json({status: token})
}