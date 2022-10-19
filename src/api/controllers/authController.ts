import {Request, Response} from 'express'
import { generateToken } from '../middlewares/auth'

//models
import User from '../models/User'

export const signUp = async(req:Request, res:Response) => {
   //Basic logic for signup
   const {email, password} = req.body

   const newUser = await User.create({
      email,
      password
   })

   const token = generateToken({_id: newUser?.id})

   res.json({status: token})
}