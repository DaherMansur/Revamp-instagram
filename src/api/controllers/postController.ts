import { Request, Response } from "express";
import sharp from "sharp";
import { unlink } from "fs/promises";
import fs from 'fs'
import mongoose from "mongoose";

//Models
import User from "../models/User"
import Post, { IPost } from "../models/Post"
import Profile from "../models/Profile"

//Services
import * as PostService from '../services/PostService'

export const createPost = async(req:Request, res:Response) => {
   let {caption} = req.body

   const files = req.files as Express.Multer.File[]

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const captionText = PostService.captionLength(caption)
   if(captionText instanceof Error) return res.json({error: captionText.message})

   const hashtag = PostService.processHashtag(captionText)

   const media = await PostService.addPhoto(files)

   const post:PostService.IPost = {
      profile: profile?.id, 
      caption: captionText,
      hashtag,
      files: media,
   }

   const newPost = await PostService.createNewPost(post)
   res.json({status:newPost})
}

export const editPost = async(req:Request, res:Response) => {
   let {caption, delMedia} = req.body
   let {id} = req.params

   if(!mongoose.Types.ObjectId.isValid(id)) {
      res.json({error: 'ID Inválido'})
      return
   }

   const files = req.files as Express.Multer.File[]

   const user = req.user as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})
   if(!profile) return res.json({error: 'Perfil não existe'})

   const post = await Post.findById(id)
   if(!post) return res.json({error: 'Post não existe'})

   const updates:IPost = {
      caption: caption ?? post?.caption
   }

   if(files){
      let error = false
      let media = []

      let order = post?.files?.length
      for(let i in files){
         if(post.files && post.files?.length >= 10) {
            error = true
            break 
         }

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

         let newOrder = parseInt(i)
         if(order){
            var newValue = parseInt(i)
            newOrder = (newValue + order)
         }

         media.push({
            url: filename,
            default: newOrder
         })
      }

      if(error) return res.json({error: 'Excedeu o limite de media(10)'})
      
      await post.updateOne({
         $push: { files: media },
      })
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
         return res.json({error: 'Imagem não encontrada'})
      }
   }

   res.json({status: updates})
}

export const getPost = async (req:Request, res:Response) => {
   const {id} = req.params

   if(!mongoose.Types.ObjectId.isValid(id)) {
      res.json({error: 'ID Inválido'})
      return
   }

   const post = await Post.findById(id)
      .populate<{profile: typeof Profile}>
      ({path: 'profile'})

   if(!post) {
      res.json({error: 'Post não existe'})
      return
   } 

   res.json({status: post})
}