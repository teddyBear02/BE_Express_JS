// Import things heres: 
import { Router } from 'express'

// Import Routes:

import AuthRouter from './auth.route'
import UserRouter from './user.route'
import BlogRouter from './blog.route'
import CommentRouter from './comment.route'

const router : Router = Router()

router.use(AuthRouter)
router.use(UserRouter)
router.use(BlogRouter)
router.use(CommentRouter)

export default router