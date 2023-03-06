import axios from 'axios'
import querystring from 'querystring';

export const getToken = async (email: string, password: string) => {
   const apiBaseUrl: string = 'http://localhost:3000/api'

   const data = {
      email, 
      password
   }

   const formData = querystring.stringify(data)
   try {
      const token = await axios.post(`${apiBaseUrl}/signin`, formData) 
      return token
   } catch (e) {
      console.log(e)
   }
}