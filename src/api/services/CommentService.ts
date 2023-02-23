import mongoose, {Types} from "mongoose";

//models
import User from '../models/User'
import Profile, { ProfileDocument } from '../models/Profile'
import Comment, {CommentDocument} from '../models/Comment'
import Post, { IPost, PostDocument } from '../models/Post'

//Types
interface GetCommentPopulateResult {
   error?: string,
   CommentDocument?: CommentDocument,
}

export {IPost}

export const validId = async(id:string): Promise<Error | void> => {
   if(!mongoose.Types.ObjectId.isValid(id)) return new Error('ID Inválido')
}

export const userProfile = async(reqUser:Express.User | undefined): Promise<ProfileDocument | Error> => {
   const user = reqUser as InstanceType<typeof User>
   const profile = await Profile.findOne({user: user?.id})

   if(!profile) return new Error('Usuário não existe')

   return profile as ProfileDocument
}

export const setComment = async(comment:string, id:string, idUser:Types.ObjectId): Promise<string | Error | CommentDocument> => {
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

export const setReply = async(comment:string, idReply:Types.ObjectId, idUser:Types.ObjectId): Promise<string | Error | CommentDocument> => {
   const reply = await Comment.findOne({_id: idReply});
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
      _id: idReply,
   }, {
      $push:{
         reply: {
            id: newComment._id
         }
      }
   });

   return newComment;
}

export const editComment = async(comment:string, idComment:Types.ObjectId, idUser:Types.ObjectId): Promise<CommentDocument | Error> => {

   const commentPost = await Comment.findOne({_id: idComment})
   if(commentPost?.idUser != idUser){
      return new Error('Você não tem permissão para editar esse comentário ') 
   }

   commentPost.idUser = idUser
   commentPost.comment = comment
   await commentPost.save()

   return commentPost
}

export const removeComment = async (idComment:Types.ObjectId, idUser:Types.ObjectId): Promise<void | Error> => {
   const comment = await Comment.findOne({_id: idComment})
   if (!comment) return new Error('Comentário não encontrado');
   if(comment?.idUser != idUser){
      return new Error('Você não tem permissão para editar esse comentário ') 
   }

   //recursive function
   if(comment?.reply){
      for (const replyId of comment?.reply) {
         await removeComment(replyId.id, idUser);
      }
   }
   await Comment.findByIdAndDelete(idComment);
   return
}

export const getComment = async(id:string): Promise<GetCommentPopulateResult> => {
   const post = await Post.findOne({_id: id}, 'comments')
      .populate<{comments: typeof Comment}>({
         path: 'comments.idComment',
         populate: [
            {path: 'idUser', model: 'Profile'},
            {path: 'reply.id', model: 'Comment', populate: [
               {path: 'idUser', model: 'Profile'},
               {path: 'reply.id', model: 'Comment'},
            ]}
         ]
      })

   return post as GetCommentPopulateResult
}