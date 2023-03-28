import { checkSchema } from "express-validator";

export const ProfileValidator = {
   edit: checkSchema({
      name: {
         optional: true,
         trim: true,
         isLength: {
            options: {max: 100},
            errorMessage: 'Nome não pode exceder mais de 100 caracteres'
         }
      },
      bio: {
         optional: true,
         trim: true,
         isLength: {
            options: {max: 150},
            errorMessage: 'Bio não pode exceder mais de 150 caracteres'
         }
      },
      website: {
         optional: true,
         trim: true,
         isLength: {
            options: {max: 100},
            errorMessage: 'Site não pode exceder mais de 100 caracteres'
         }
      },
      celphone: {
         optional:true,
         trim:true,
         isInt: true,
         toInt: true
      },
      gender: {
         optional: true,
         trim: true
      }
   })
}