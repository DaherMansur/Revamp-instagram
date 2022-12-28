import sharp from "sharp";
import { unlink } from "fs/promises";
import fs from 'fs'
import mongoose from "mongoose";

//models
import User from '../models/User'
import Profile from '../models/Profile'
import Post, { IPost, Hashtag, Files } from '../models/Post'

export {IPost}

export const userProfile = async(reqUser:Express.User | undefined) => {
   const user = reqUser as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})

   if(!profile) return new Error('Usuário não existe')

   return profile
}

export const captionLength = (caption:string) => {
   if(caption.length > 2200) return new Error('A legenda excedeu o número de caracteres(2200)')
   return caption
}

export const processHashtag = (caption:string) => {
   const hashtag:Hashtag[] = []
   if(caption) {
      for(let i = 0; i < caption.length; i++){
         let startOfTag:number = caption.indexOf('#', i)
         if(startOfTag === -1) break

         let endOfTag = caption.indexOf(' ', startOfTag)
         if(endOfTag === -1) {
            caption += " "
            continue
         }

         let tag = caption.substring(startOfTag, endOfTag)
         if(tag && tag.length > 1) {
            hashtag.push({name: tag})
         }
         i = endOfTag
      }
   }
   return hashtag
}

export const addPhoto = async(files:Express.Multer.File[]) => {
   const media:Files[] = []
   for(let i in files){
      let filename = files[i].filename
      let [type, extension] = files[i].mimetype.split('/')

      if(type === 'image'){
         await sharp(files[i].path)
            .toFile(`./public/assets/media/${filename}.${extension}`)

         sharp.cache(false)
         unlink(files[i].path)
      }

      if(type === 'video'){
         let filename = files[i].filename
         let oldPath = files[i].path
         let newPath = `./public/assets/media/${filename}.${extension}`
         fs.rename(oldPath, newPath, (err) => {
            if(err) console.log(err)
         })
      }
      media.push({
         url: `${filename}.${extension}`,
         default: parseInt(i)
      }) 
   }
   return media
}

export const createNewPost = async(data:IPost) => {
   
   const newPost = new Post(data)
   await newPost.save()
   return newPost
}