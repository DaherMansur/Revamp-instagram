import { Request, Response } from "express";

//Services
import * as CommentService from '../services/CommentService'

export const commentPost = async(req:Request, res:Response) => {
   const id = req.params.id as string
   const comment = req.body.comment as string

   const profile = await CommentService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const commentPost = await CommentService.setComment(comment, id, profile?.id)
   if(commentPost instanceof Error) return res.json({error: commentPost.message})

   res.json({commentPost})
}

export const replyPost = async (req:Request, res:Response) => {
   const idPost = req.params.id as string
   const idreply = req.body.idreply as any
   const comment = req.body.comment as string

   const profile = await CommentService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const isValid = await CommentService.validId(idPost)
   if(isValid instanceof Error) return res.json({error: isValid.message })

   const replyPost = await CommentService.setReply(comment, idreply, profile?.id)
   if(replyPost instanceof Error) return res.json({error: replyPost.message})

   res.json({replyPost})
}

export const editCommentPost = async(req:Request, res:Response) => {
   const idPost = req.params.id as string
   const idComment = req.body.idComment as any
   const comment = req.body.comment as string

   const profile = await CommentService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const isValid = await CommentService.validId(idPost)
   if(isValid instanceof Error) return res.json({error: isValid.message })

   const commentUpdate = await CommentService.editComment(comment, idComment, profile?.id)
   if(commentUpdate instanceof Error) return res.json({error: commentUpdate.message})
   
   res.json({commentUpdate})
}

export const deleteComment = async (req:Request, res:Response) => {
   const idPost = req.params.id as string
   const idComment = req.body.idComment as any

   const profile = await CommentService.userProfile(req.user)
   if(profile instanceof Error) return res.json({error: profile.message})

   const isValid = await CommentService.validId(idPost)
   if(isValid instanceof Error) return res.json({error: isValid.message })

   const removeComment = await CommentService.removeComment(idComment, profile?.id)
   if(removeComment instanceof Error) return res.json({error: removeComment.message})

   res.json({deleted: true})
}