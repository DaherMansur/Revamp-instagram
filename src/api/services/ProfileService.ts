import {Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import fs from 'fs'

import User from '../models/User'
import Profile, {IProfile} from '../models/Profile'

export const checkEditable = async(username:string, reqUser:Express.User | undefined) => {
   const user = reqUser as InstanceType<typeof User>

   //Checks if the username in the URL is the same as the logged user
   let editable = false
   if(username === user?.username) editable = true

   return editable
}

export const findProfile = async(username:string) => {
   const user = await User.findOne({username})
   if(!user) return new Error('Perfil não encontrado')

   const profile = await Profile.findOne({user: user?.id})
      .populate<{user: typeof User}>
      ({path: 'user', select: 'username'})
   
   return profile
}