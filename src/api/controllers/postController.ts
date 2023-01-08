import { Request, Response } from "express";
import sharp from "sharp";
import { unlink } from "fs/promises";
import fs from 'fs'
import mongoose, { WindowOperatorReturningNumber } from "mongoose";

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

   const media = await PostService.processMedia(files, undefined)

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

   const validId = await PostService.validId(id)
   if(validId instanceof Error) return res.json({error: validId.message})

   const files = req.files as Express.Multer.File[]

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const post = await PostService.findPostEditable(id, profile?.id)
   if(post instanceof Error) return res.json({error: post.message})
   
   const media = await PostService.processMedia(files, post?.files)

   const updates:IPost = {
      profile: profile?.id,
      caption: caption ?? post?.caption,
      files: media
   }

   await Post.findByIdAndUpdate(id, {$set: updates})   
   res.json({status: updates})
}

export const deleteMedia = async(req:Request, res:Response) => {
   const filename = req.body.filename as string
   const {id} = req.params

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const post = await PostService.findPostEditable(id, profile?.id)
   if(post instanceof Error) return res.json({error: post.message})

   const media = await PostService.deleteMediaAndReOrder(filename, post?.files)
   if(media instanceof Error) return res.json({error: media.message})

   res.json({media})
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


