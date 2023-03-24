import passport from 'passport'
import {Strategy as JwtStategy, ExtractJwt} from 'passport-jwt'
import jwt from 'jsonwebtoken'
import {NextFunction, Request, Response} from 'express'
import dotenv from 'dotenv'
import {IUser} from '../models/User'

dotenv.config()

//Models
import User from '../models/User'

const notAuthorizedJson = {status:401, message: 'É necessário estar logado para completar a ação'}
const options = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: process.env.JWT_KEY as string
}

passport.use(new JwtStategy(options, async(payload, done) => {
   console.log(payload)
   const user = await User.findOne({_id: payload})

   if (user) {
      return done(null, user);
   } else {
      return done(notAuthorizedJson, false);
   }
}))

//Only logged user can see it
export const privateRoute = (req:Request, res:Response, next:NextFunction) => {
   const authFunction = passport.authenticate('jwt', (err:any, user:IUser) => {
      if(user){
         req.user = user
         next()
      } else {
         next(notAuthorizedJson)
      }
   })
   authFunction(req, res, next)
}

//Publics Routes means everyone can see it.
export const publicRoute = (req:Request, res:Response, next:NextFunction) => {
   const authFunction = passport.authenticate('jwt', (err:any, user:IUser) => {
      if(user){
         req.user = user
         next()
      } else {
         next()
      }
   })
   authFunction(req, res, next)
}

export const generateToken = async(data:Object) => {
   const user = await findUser(data)
   const dataForm = {
      email: user?.email,
      username: user?.username,
      _id: user?._id
   }
   return jwt.sign(dataForm, process.env.JWT_KEY as string)
}

const findUser = async(id:Object) => {
   return await User.findOne({_id: id})
}

export default passport