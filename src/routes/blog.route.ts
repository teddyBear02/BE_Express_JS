import { Router } from 'express'
import { expressjwt as jwts } from 'express-jwt'
import { body } from 'express-validator'
import { 
    getAllBlogs, 
    getBlogByUserId, 
    getPostById, 
    deletePostById, 
    updatePost,
    createNewPost
} from '../controllers/blog.controller'

const router = Router()
const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY


router.get('/api/blogs',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    getAllBlogs
)

router.get('/api/blog/user/:user_id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    getBlogByUserId
)

router.post('/api/blog',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    [
        body("Content")
        .notEmpty()
        .withMessage("Content can't be empty !")
        .isLength({min:2})
        .withMessage("Blog content is more than 1 characters !")
    ],
    createNewPost
)


router.put('/api/blog/:id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    updatePost
)

    
router.delete('/api/blog/:id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    deletePostById
)


router.get('/api/blog/:id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    getPostById
)

export default router