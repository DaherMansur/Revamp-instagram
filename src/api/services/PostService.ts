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

export const validId = async(id:string) => {
   if(!mongoose.Types.ObjectId.isValid(id)) return new Error('ID Inválido')
}

export const checkEditable = async(idProfileUser:string, idProfilePost:string) => {
   if(idProfileUser !== idProfilePost) {
      return new Error('Você não tem permissão para editar esse post')
   }
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

export const addPhotoStorage = async(files:Express.Multer.File[], x:string) => {
   let i = parseInt(x)
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
   return filename
}

export const reOrderMedia = async(i:string, order: number | undefined) => {
   let newOrder = parseInt(i)
   if(order){
      var newValue = parseInt(i)
      newOrder = (newValue + order)
   }
   return newOrder
}

export const processMedia = async(files:Express.Multer.File[], mediaPost:Files[] | undefined) => {
   let media:Files[] = []
   let order = undefined
   if(mediaPost){
      media = mediaPost
      order = mediaPost?.length
   }
   
   for(let i in files) {
      const filename = await addPhotoStorage(files, i)
      const newOrder = await reOrderMedia(i, order)
      media.push({
         url: filename,
         default: newOrder
      })
   }
   return media
}

export const findPostEditable = async(idPost:string, idProfileUser:string) => {
   const post = await Post.findById(idPost)
   if(!post) return new Error('Post não existe')

   const editable = await checkEditable(idProfileUser, post?.profile?.toString())
   if(editable instanceof Error) return Error(editable.message)

   return post
}

// export const reOrderMedia = async(media:Files, id:string) => {
//    const files:Files[] = []
//    const post = await Post.findById(id)
   
//    let order = post?.files?.length
//    function reOrder(i:string) {
//       let newOrder = parseInt(i)
//       if(order){
//          var newValue = parseInt(i)
//          newOrder = (newValue + order)
//       }
//       return newOrder
//    }
//    // for(let i in media) {
      
//    //    files.push({
//    //       url: media?.url,
//    //       default: newOrder
//    //    })
//    // }
//    return files
// }

export const createNewPost = async(data:IPost) => {
   
   const newPost = new Post(data)
   await newPost.save()
   return newPost
}

//

