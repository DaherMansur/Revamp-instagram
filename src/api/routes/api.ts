import {Request, Response, Router} from 'express'

//Controllers

const router = Router()

router.get('/ping', (req:Request, res:Response) => {
   res.json({pong: true})
}) 


export default router

