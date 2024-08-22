import { Router } from 'express'
import { body } from 'express-validator'
import { algorithm } from '../helpers/jwtOAuthHelper'
import { 
    getAllBlogs, 
    getBlogByUserId, 
    getPostById, 
    deletePostById, 
    updatePost,
    createNewPost
} from '../controllers/blog.controller'

const router = Router()

router.get('/api/blogs', algorithm, getAllBlogs )

router.get('/api/blog/user/:user_id', algorithm, getBlogByUserId )

router.get('/api/blog/:id', algorithm, getPostById )

router.post('/api/blog', algorithm,
    [
        body("content")
        .notEmpty()
        .withMessage("Content can't be empty !")
        .isLength({min:2})
        .withMessage("Blog content is more than 1 characters !")
    ],
    createNewPost
)

router.put('/api/blog/:id', algorithm, updatePost )
    
router.delete('/api/blog/:id', algorithm, deletePostById )

export default router