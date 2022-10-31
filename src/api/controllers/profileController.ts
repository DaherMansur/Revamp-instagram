import {Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'
import sharp from 'sharp'
import { unlink } from 'fs/promises'
import fs ,{ createWriteStream, createReadStream } from 'fs'

import User from '../models/User'
import Profile, {IProfile} from '../models/Profile'

export const edit = async (req:Request, res:Response) => {
   const {bio, name, website, celphone, gender} = req.body

   const user = req.user as InstanceType<typeof User>

   const file = req.file

   const updates:IProfile = {
      name,
      bio,
      website,
      celphone,
      gender,
   }

   if(file){
      const [type, extension] = file?.mimetype.split('/')
      const filename = file?.filename

      if(type === 'video'){
         const newPath = `./public/media/videos/${filename}.${extension}`
         fs.rename(file?.path, newPath, (err) => {
            if(err) console.log(err)
         })
         updates.photo?.push({
            url: file?.filename
         })
      }

      if(type === 'image') {
         await sharp(file?.path)
            .toFormat('png')
            .resize(200)
            .toFile(`./public/media/images/${filename}.png`)
         
         //Use this whenever you use unlink
         sharp.cache(false);
         await unlink(file.path)
      }
      
   }
   
   await Profile.findOneAndUpdate(user?.id, {$set: updates})

   res.json({status:updates})
}
