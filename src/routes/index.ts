// Import things heres: 
import { Router } from 'express'

// Import Routes:

import AuthRouter from './auth.route'
import UserRouter from './user.route'
import BlogRouter from './blog.route'

const router : Router = Router()

router.use(AuthRouter)
router.use(UserRouter)
router.use(BlogRouter)

export default router