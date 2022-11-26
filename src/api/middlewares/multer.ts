import {Response, Request, NextFunction } from 'express'
import multer, { MulterError } from 'multer'
import { v4 as uuidv4 } from 'uuid'

interface ResponseError extends Error {
   status?: number
}

const storageConfig = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './temp')
   },
   filename: (req, file, cb) => {
      const filename = uuidv4()
      cb(null, `${filename}`)
   }
})

export const uploadAvatar = (req:Request, res:Response, next:NextFunction) => {
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
   const errorMulterHandler = configAvatar.single('photo')
   errorMulterHandler(req, res, (err) => {
      if(err instanceof multer.MulterError){
         const error:ResponseError = new Error('Excedeu o limite de arquivos')
         error.status = 418// TeaPot!
         next(error)
      } else if(err){
         const error:ResponseError = new Error('Aconteceu alguma coisa ae')
         error.status = 418// TeaPot!
         next(error)
      }
      next()
   })
}

export const uploadFiles = (req:Request, res:Response, next:NextFunction) => {
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

   const errorMulterHandler = configFiles.array('files', 10)
   errorMulterHandler(req, res, (err) => {
      if(err instanceof multer.MulterError){
         const error:ResponseError = new Error('Excedeu o limite de arquivos')
         error.status = 418// TeaPot!
         next(error)
      } else if(err){
         const error:ResponseError = new Error('Aconteceu alguma coisa ae')
         error.status = 418// TeaPot!
         next(error)
      }
      next()
   })
}
