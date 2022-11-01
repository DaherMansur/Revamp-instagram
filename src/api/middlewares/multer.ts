import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'

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
         interface ResponseError extends Error {
            status?: number
         }

         const error:ResponseError = new Error('Tipo de arquivo inválido')
         error.status = 418// TeaPot!
         return cb(error)
      }

      cb(null, fileMime);
   }
})

