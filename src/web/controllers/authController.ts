import {Request, Response} from 'express'

//services
import * as AuthService from '../services/AuthService'

export const index = async(req:Request, res:Response) => {
   const user = req.user
   res.render('index', user)
}

export const login = async(req:Request, res:Response) => {
   const email:string = req.body.email as string
   const password:string = req.body.password as string

   const token = await AuthService.getToken(email, password)
   res.cookie('jwt', token?.data, {
      httpOnly: true,
      secure: true,
   });
   res.set('Authorization', `Bearer ${token?.data}`)
   res.redirect('/')
}

export const teste = async(req:Request, res:Response) => {
   const user = req.user
   res.render('teste', user)
}