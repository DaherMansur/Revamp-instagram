import { Request, Response } from "express";

//Models
import User from "../models/User"
import Post from "../models/Post"
import Profile from "../models/Profile"

export const createPost = async(req:Request, res:Response) => {
   let {caption} = req.body

   const user = req.user as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})
   if(!profile) return res.json({error: 'Perfil não existe'})

   let hashtags = []
   if(caption){
      if(caption.length > 2200) return res.json({error: 'A legenda excedeu o número de caracteres(2200)'})
      
      for(let i = 0; i < caption.length; i++){
         let startOfTag = caption.indexOf('#', i)
         if(startOfTag === -1) {
            caption += ' '
            break
         }

         let endOfTag = caption.indexOf(' ', startOfTag)
         let tag = caption.substr(startOfTag, endOfTag-startOfTag)
         if(tag && tag.length > 1) {
            hashtags?.push({name: tag})
         }
         i = startOfTag
      }
   }

   
   
   //console.log(tags)
   


   const newPost = new Post()
   newPost.caption = caption
   newPost.hashtag = hashtags
   newPost.profile = profile?.id
   await newPost.save()

   res.json({status:newPost})
}