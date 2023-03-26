import {Request, Response} from 'express'

//Models
import Post from '../models/Post'

export const searchHashtag = async(req:Request, res:Response) => {
   const tag = req.params.hashtag as string 

   const hashtag = `#${tag}`

   const getHashtag = await Post.find({
      hashtag: {
         $elemMatch: {
            name: hashtag
         }
      }
   })
   
   res.json({getHashtag})
}