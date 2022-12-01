import {Request, Response} from 'express'
import { generateToken } from '../middlewares/auth'
import {validationResult, matchedData} from 'express-validator'
import bcrypt from 'bcrypt'

import * as AuthService from '../services/AuthService'

//models
import User from '../models/User'
import Profile from '../models/Profile'

export const signUp = async(req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()})

   const data = matchedData(req)
   const user = {
      username: data?.username,
      email: data?.email,
      password: data?.password
   }

   const token = await AuthService.createUser(user)
   if(token instanceof Error){
      res.status(500).json({error: token.message})
      return
   }

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