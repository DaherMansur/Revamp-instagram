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


export const upload = multer({
   storage: storageConfig,
   fileFilter: (req, file, cb ) => {
      const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

      cb(null, allowed.includes(file.mimetype));
      
   }
})