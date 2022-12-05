import {Request, Response} from 'express'
import {validationResult, matchedData} from 'express-validator'

//Service
import * as AuthService from '../services/AuthService'

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

   res.json({token})
}

export const signIn = async (req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.status(400).json({errors: errors.mapped()})

   const data = matchedData(req)

   const token = await AuthService.login(data?.email, data?.password)
   if(token instanceof Error){
      res.status(500).json({error: token.message})
      return
   }

   res.json({token})
}