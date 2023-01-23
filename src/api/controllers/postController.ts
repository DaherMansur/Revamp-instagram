import { Request, Response } from "express";

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
   let {caption} = req.body
   let {id} = req.params

   const validId = await PostService.validId(id)
   if(validId instanceof Error) return res.json({error: validId.message})

   const files = req.files as Express.Multer.File[]

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const post = await PostService.findPostEditable(id, profile?.id)
   if(post instanceof Error) return res.json({error: post.message})
   
   const media = await PostService.processMedia(files, post?.files)

   const updates:PostService.IPost = {
      profile: profile?.id,
      caption: caption ?? post?.caption,
      files: media
   }

   await PostService.updatePost(id, updates)
   res.json({status: updates})
}

export const deleteMedia = async(req:Request, res:Response) => {
   const filename = req.body.filename as string
   const {id} = req.params

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const post = await PostService.findPostEditable(id, profile?.id)
   if(post instanceof Error) return res.json({error: post.message})

   await PostService.removeMedia(filename, post?.id)
   res.json({media:true})
}

export const getPost = async (req:Request, res:Response) => {
   const {id} = req.params

   const post = await PostService.getPostPopulate(id)
   if(post instanceof Error) res.json({error: post.message})

   res.json({status: post})
}

export const reOrderMedia = async (req:Request, res:Response) => {
   const fileOne = req.body.filename as string
   const moveTo = req.body.moveTo as number
   const {id} = req.params

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const post = await PostService.findPostEditable(id, profile?.id)
   if(post instanceof Error) return res.json({error: post.message})

   const newOrder = await PostService.spliceMedia(fileOne, moveTo, post?.files)

   const updates:PostService.IPost = {
      profile: profile?.id,
      files: newOrder
   }
   await PostService.updatePost(id, updates)
   res.json({status:updates})
}

export const likePost = async(req:Request, res:Response) => {
   const id = req.params.id as string

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const like = await PostService.setLike(id, profile?.id)

   res.json({like})
}

export const commentPost = async(req:Request, res:Response) => {
   const id = req.params.id as string
   const comment = req.body.comment as string

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const commentPost = await PostService.setComment(comment, id, profile?.id)
   if(commentPost instanceof Error) return res.json({error: commentPost.message})

   res.json({commentPost})
}

export const replyPost = async (req:Request, res:Response) => {
   const idPost = req.params.id as string
   const idreply = req.body.idreply as any
   const comment = req.body.comment as string

   const profile = await PostService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const replyPost = await PostService.setReply(comment, idPost, idreply, profile?.id)
   if(replyPost instanceof Error) return res.json({error: replyPost.message})

   res.json({replyPost})
}