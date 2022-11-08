import multer from 'multer'
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

export const uploadPhoto = multer({
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

export const uploadFiles = multer({
   storage: storageConfig,
   limits: {files: 10},
   fileFilter: (req, file, cb,) => {
      const allowed: string[] = [
         'image/jpg', 'image/jpeg', 'image/png', 'image/gif', 
         'video/mp4', 'video/mkv', 'video/avi'
      ];
      //If the limit exceeds
      let count = 0
      for(let i in file){
         count += 1
      }
      if(count > 10){
         const error:ResponseError = new Error('Tipo de arquivo inválido')
         error.status = 418// TeaPot!
         return cb(error)
      }

      const fileMime = allowed.includes(file.mimetype)

      if(!fileMime){
         const error:ResponseError = new Error('Tipo de arquivo inválido')
         error.status = 418// TeaPot!
         return cb(error)
      }
      cb(null, fileMime);
   }
})
