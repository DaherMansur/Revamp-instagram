import { Request, Response } from "express";
import sharp from "sharp";
import { unlink } from "fs/promises";
import fs from 'fs'
import { MulterError } from "multer";

//Models
import User from "../models/User"
import Post, { IPost } from "../models/Post"
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

   let media = []
   if(files){
      //ErrorHandler bug???
      if(files.length > 10) return res.json({error: 'Excedeu o limite de envios simultaneos(10)'})
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
            default: false
         })
         if(files[0]) media[0].default = true
      }
   }
   newPost.files = media
   await newPost.save()
   res.json({status:newPost})
}

export const editPost = async(req:Request, res:Response) => {
   let {caption, delMedia} = req.body
   let {id} = req.params

   const files = req.files as Express.Multer.File[]

   const user = req.user as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})
   if(!profile) return res.json({error: 'Perfil não existe'})

   const post = await Post.findById(id)

   const updates:IPost = {
      caption: caption ?? post?.caption
   }

   if(files){

   }

   
   if(delMedia){ //Delete Media
      let asset = false
      post?.files?.forEach((e) => {
         if(e.url == delMedia){
            asset = true
         }
      })

      if(asset) {
         await post?.updateOne({$pull: {
            files: {url: delMedia}
         }})
         unlink(`./public/assets/media/${delMedia}`)
      } else {
         return res.json({error: 'Essa imagem não é sua'})
      }
   }


   res.json({status: delMedia})
}