import {Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'
import sharp from 'sharp'
import { unlink } from 'fs/promises'

import User from '../models/User'
import Profile, {IProfile} from '../models/Profile'

export const edit = async (req:Request, res:Response) => {
   const {bio, name, website, celphone, gender} = req.body

   const user = req.user as InstanceType<typeof User>

   const file = req.file
   if(file){
      const filename = file?.filename
      await sharp(file?.path)
         .resize(200)
         .toFormat('png')
         .toFile(`./public/media/images/${filename}.png`)

      //Use this whenever you use unlink
      sharp.cache(false);
      await unlink(file.path)
   }

   const updates:IProfile = {
      name,
      bio,
      website,
      celphone,
      gender
   }
   
   await Profile.findOneAndUpdate(user?.id, {$set: updates})

   res.json({status:updates})
}
