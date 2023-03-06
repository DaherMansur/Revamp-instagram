import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import {Strategy as JwtStategy, ExtractJwt} from 'passport-jwt'
import passport from 'passport'
import dotenv from 'dotenv'
import User from '../../api/models/User'

dotenv.config()

const cookieExtractor = (req:Request) => {
   let jwt = null
   if (req && req.signedCookies && req.signedCookies.jwt) {
       jwt = req.cookies.jwt.token
   }
   return jwt
}

const options = {
   jwtFromRequest: cookieExtractor,
   secretOrKey: process.env.JWT_KEY as string
}

passport.use(new JwtStategy(options, async(payload, done) => {
   const user = payload

   if (user) {
      return done(null, user);
   } else {
      return done(null, false);
   }
}))

export const privateRoute = (req:Request, res:Response, next:NextFunction) => {
   const authFunction = passport.authenticate('jwt', (err:any, user:any) => {

      if (err) {
         console.error(err)
         return next(err)
       }
       if (!user) {
         console.log('User not found')
         return next()
       }
       console.log('User found:', user)
       req.user = user
       next()
   })
   authFunction(req, res, next)
}

