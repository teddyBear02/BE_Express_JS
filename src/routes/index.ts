// Import middlewares or link utils heres: 

import { Router } from 'express'

// Import Controllers:

import userRouter from '../controllers/userController'
import blogRouter from '../controllers/blogController'

const router : Router = Router()

router.use(userRouter)
router.use(blogRouter)

export default router