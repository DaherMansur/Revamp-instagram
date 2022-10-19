import passport from 'passport'
import {Strategy as JwtStategy, ExtractJwt} from 'passport-jwt'
import jwt from 'jsonwebtoken'
import {Request, Response} from 'express'

//Models
import User from '../models/User'

const notAuthorizedJson = {status:401, message: 'Não autorizado'}
const options = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: 'secret'
}

passport.use(new JwtStategy(options, async(payload, done) => {
   const user = await User.findOne({_id: payload})

   if (user) {
      return done(null, user);
   } else {
      return done(notAuthorizedJson, false);
   }
}))