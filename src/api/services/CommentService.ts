import mongoose, {Types} from "mongoose";

//models
import User from '../models/User'
import Profile from '../models/Profile'
import Comment from '../models/Comment'
import Post, { IPost } from '../models/Post'

export {IPost}

export const validId = async(id:string) => {
   if(!mongoose.Types.ObjectId.isValid(id)) return new Error('ID Inválido')
}

export const userProfile = async(reqUser:Express.User | undefined) => {
   const user = reqUser as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})

   if(!profile) return new Error('Usuário não existe')

   return profile
}

export const setComment = async(comment:string, id:string, idUser:Types.ObjectId) => {
   const isValid = await validId(id)
   if(isValid instanceof Error) return isValid.message

   const newComment = new Comment()
   newComment.comment = comment
   newComment.idUser = idUser
   newComment.save()

   const post = await Post.findByIdAndUpdate(id, {
      $push: {
         comments: {
            idComment: newComment?.id
         }
      }
   })

   if(!post) return new Error('Post não existe')
   return newComment
}

export const setReply = async(comment:string, idreply:Types.ObjectId, idUser:Types.ObjectId) => {
   const reply = await Comment.findOne({_id: idreply});
   if (!reply) return new Error('Comentário não existe');
   if (reply.depth >= reply.maxDepth) return new Error('Profundidade máxima atingida');

   const newComment = new Comment({
      comment,
      idUser,
      depth: reply.depth + 1,
      maxDepth: reply.maxDepth
   });
   await newComment.save();

   await Comment.findOneAndUpdate({
      _id: idreply,
   }, {
      $push:{
         reply: {
            id: newComment._id
         }
      }
   });

   return newComment;
}