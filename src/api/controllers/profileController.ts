import {Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'
import sharp from 'sharp'
import { unlink } from 'fs/promises'

import User from '../models/User'
import Profile, {IProfile} from '../models/Profile'

export const getProfile = async(req:Request, res:Response) => {
   const username = req.params.username as string

   const user = req.user as InstanceType<typeof User>

   let userId
   if(username === user?.username) {
      userId = user?.id

   }else { 
      const notUser = await User.findOne({username})
      if(!notUser) return res.json({error: 'Usuário não encontrado'})

      userId = notUser?.id
   }
   const profile = await Profile.findOne({user: userId})
      .populate<{user: typeof User}>
      ({path: 'user', select: 'username'})
   

   res.json({status: profile})
}

export const edit = async (req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.json({error: errors.mapped()})

   const data = matchedData(req)
   
   const user = req.user as InstanceType<typeof User>
   const file = req.file
   
   const profile = await Profile.findOne({user: user?.id})

   if(!profile) res.json({error: 'Usuário não existe'})

   const updates:IProfile = {
      name: data.name ?? profile?.name,
      bio: data.bio ?? profile?.bio,
      website: data.website ?? profile?.website,
      celphone: data.celphone ?? profile?.celphone,
      gender: data.gender ?? profile?.gender,
      photo: []
   }

   if(file){
      await sharp(file?.path)
         .toFormat('png')
         .resize(200)
         .toFile(`./public/media/images/${file?.filename}.png`)

      profile?.photo?.forEach(async (e) => {
         if(e.url) await unlink(`./public/media/images/${e.url}.png`)
      })

      updates.photo?.push({
         url: file?.filename
      }) 

      //Use this whenever you use unlink
      sharp.cache(false);
      await unlink(file.path)
   }
   await profile?.updateOne(updates)

   res.json({status: updates})
}