import {Request, Response} from 'express'
import { matchedData, validationResult } from 'express-validator'

//Services
import * as ProfileService from '../services/ProfileService'

export const getProfile = async(req:Request, res:Response) => {
   const username = req.params.username as string 

   const profile = await ProfileService.findProfile(username)
   
   const editable = await ProfileService.checkEditable(username, req.user)

   const data = {
      editable, 
      profile
   }

   res.json({data})
}

export const edit = async (req:Request, res:Response) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) return res.json({error: errors.mapped()})

   const data = matchedData(req)
   const file = req.file

   const profile = await ProfileService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const photoName = await ProfileService.processPhoto(file, profile?.id)

   const updates:ProfileService.IProfile = {
      name: data.name,
      bio: data.bio,
      website: data.website,
      celphone: data.celphone,
      gender: data.gender,
      photo: [photoName]
   }

   await ProfileService.updateProfile(updates, profile?.id)

   res.json({status: updates})
}

export const followProfile = async(req:Request, res:Response) => {
   const username = req.params.username as string
   
   const profile = await ProfileService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const getFollow = await ProfileService.setFollowing(username, profile?.id)

   res.json({status: getFollow})
}