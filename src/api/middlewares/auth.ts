import passport from 'passport'
import {Strategy as JwtStategy, ExtractJwt} from 'passport-jwt'
import jwt from 'jsonwebtoken'
import {NextFunction, Request, Response} from 'express'
import dotenv from 'dotenv'

dotenv.config()

//Models
import User from '../models/User'

const notAuthorizedJson = {status:401, message: 'Não autorizado'}
const options = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: process.env.JWT_KEY as string
}

passport.use(new JwtStategy(options, async(payload, done) => {
   const user = await User.findOne({_id: payload})

   if (user) {
      return done(null, user);
   } else {
      return done(notAuthorizedJson, false);
   }
}))

export const privateRoute = (req:Request, res:Response, next:NextFunction) => {
   const authFunction = passport.authenticate('jwt', (err, user) => {
      if(user){
         req.user = user
         next()
      } else {
         next(notAuthorizedJson)
      }
   })
   authFunction(req, res, next)
}

export const generateToken = (data:Object) => {
   return jwt.sign(data, process.env.JWT_KEY as string)
}

export default passport