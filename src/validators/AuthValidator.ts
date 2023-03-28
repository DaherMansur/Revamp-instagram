import { checkSchema } from "express-validator";

export const AuthValidator = {
   register: checkSchema({
      username: {
         trim: true,
         isLength: {
            options: {min:3},
            errorMessage: 'Nome precisa ter ao menos 3 caracteres'
         }
      },
      email: {
         isEmail: true,
         normalizeEmail: true,
         errorMessage: 'Email inválido'
      },
      password: {
         isLength: {
            options: {min: 6}
         },
         errorMessage: 'Senha precisa ter mais de 6 caracteres'
      }
   }),
   login: checkSchema({
      email: {
         isEmail: true,
         normalizeEmail: true,
         errorMessage: 'Email inválido'
      },
      password: {
         isLength: {
            options: {min: 6}
         },
         errorMessage: 'Senha precisa ter mais de 6 caracteres'
      }
   })
}