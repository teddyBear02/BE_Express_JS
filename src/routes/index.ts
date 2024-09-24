// Import things heres: 
import router from '../helpers/router.helper'

// Import Routes:
import AuthRouter from './auth.route'
import UserRouter from './user.route'
import BlogRouter from './blog.route'
import CommentRouter from './comment.route'

router.use(
    [
        AuthRouter,
        UserRouter,
        BlogRouter,
        CommentRouter
    ]
)

export default router