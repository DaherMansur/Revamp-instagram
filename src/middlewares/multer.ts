import {Response, Request, NextFunction } from 'express'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

interface ResponseError extends Error {
   status?: number
}

//Errors
const errorMulter = {message: 'Excedeu o limite de arquivos', status: 413}
const errorUnknown = {message: 'Tipo de arquivo inválido', status: 418}

//Temporary storage configuration.
const storageConfig = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './temp')
   },
   filename: (req, file, cb) => {
      const filename = uuidv4()
      cb(null, `${filename}`)
   }
})

// Configuration of file filtering by type and saving in temporary folder.
// Usage: avatar and files in general for posts and stories.
const configAvatar = multer({
   storage: storageConfig,
   fileFilter: (req, file, cb ) => {
      const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

      const fileMime = allowed.includes(file.mimetype)

      if(!fileMime){
         const error:ResponseError = new Error('Tipo de arquivo inválido')
         error.status = 418// TeaPot!
         return cb(error)
      }

      cb(null, fileMime);
   }
})

const configFiles = multer({
   storage: storageConfig,
   limits: {files: 10},
   fileFilter: (req, file, cb) => {
      const allowed: string[] = [
         'image/jpg', 'image/jpeg', 'image/png', 'image/gif', 
         'video/mp4', 'video/mkv', 'video/avi'
      ];

      const fileMime = allowed.includes(file.mimetype)

      if(!fileMime){
         const error:ResponseError = new Error('Tipo de arquivo inválido')
         error.status = 418// TeaPot!
         return cb(error)
      }
      cb(null, fileMime);
   }
})

// Middleware that will be applied in the route + built-in ErrorHandler.
// From: avatar and files in general for posts and stories.
export const uploadAvatar = (req:Request, res:Response, next:NextFunction) => { 
   const errorMulterHandler = configAvatar.single('photo')

   errorMulterHandler(req, res, (err => {
      if(err instanceof multer.MulterError){
         next(errorMulter)
      } else if(err){
         next(errorUnknown)
      }
      next()
   }))
}

export const uploadFiles = (req:Request, res:Response, next:NextFunction) => {
   const errorMulterHandler = configFiles.array('files', 10)

   errorMulterHandler(req, res, (err => {
      if(err instanceof multer.MulterError){
         next(errorMulter)
      } else if(err){
         next(errorUnknown)
      }
      next()
   }))
}



