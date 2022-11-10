import { Request, Response } from "express";
import sharp from "sharp";
import { unlink } from "fs/promises";
import fs from 'fs'
import { MulterError } from "multer";

//Models
import User from "../models/User"
import Post from "../models/Post"
import Profile from "../models/Profile"

export const createPost = async(req:Request, res:Response) => {
   let {caption} = req.body

   const files = req.files as Express.Multer.File[]

   const user = req.user as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})
   if(!profile) return res.json({error: 'Perfil não existe'})

   const newPost = new Post()
   newPost.profile = profile?.id

   if(caption){
      if(caption.length > 2200) return res.json({error: 'A legenda excedeu o número de caracteres(2200)'})
      
      for(let i = 0; i < caption.length; i++){
         let startOfTag = caption.indexOf('#', i)
         if(startOfTag === -1) break
         
         let endOfTag = caption.indexOf(' ', startOfTag)
         if(endOfTag === -1) caption += ' '

         let tag = caption.substr(startOfTag, endOfTag-startOfTag)
         if(tag && tag.length > 1) {
            newPost.hashtag?.push({name: tag})
         }
         
         i = endOfTag
      }
      newPost.caption = caption
   }

   if(files){
      //ErrorHandler bug???
      if(files.length > 10) return res.json({error: 'Excedeu o limite de envios simultaneos(10)'})
      for(let i in files){
         let filename = files[i].filename
         let [type, extension] = files[i].mimetype.split('/')

         if(type === 'image'){
            await sharp(files[i].path)
               .toFile(`./public/media/images/${filename}.${extension}`)

            newPost.files.push({
               url: filename,
               default: false
            })

            sharp.cache(false)
            unlink(files[i].path)
         }

         if(type === 'video'){
            let filename = files[i].filename
            let oldPath = files[i].path
            let newPath = `./public/media/videos/${filename}.${extension}`
            fs.rename(oldPath, newPath, (err) => {
               if(err) console.log(err)
            })

            newPost.files.push({
               url: filename,
               default: false
            })
         }
         if(files[0]) newPost.files[0].default = true
      }
   }

   await newPost.save()
   res.json({status:newPost})
}

export const editPost = async(req:Request, res:Response) => {


   res.json({status: true})
}