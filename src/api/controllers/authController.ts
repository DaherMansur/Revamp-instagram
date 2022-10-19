import {Request, Response} from 'express'

//models
import User from '../models/User'

export const signUp = (req:Request, res:Response) => {


   res.json({status: true})
}