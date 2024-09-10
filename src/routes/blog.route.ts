import { body } from 'express-validator'
import { algorithm } from '../helpers/jwtOAuthHelper'
import router from '../helpers/router.helper'
import { 
    getAllBlogs, 
    getBlogByUserId, 
    getPostById, 
    deletePostById, 
    updatePost,
    createNewPost
} from '../controllers/blog.controller'


router.post('/api/blogs', algorithm,
    [
        body("pagination")
            .notEmpty()
            .withMessage("Pagination can't be empty !")
            .custom(value => {
                if (typeof value !== 'object' || Object.keys(value).length === 0) {
                    throw new Error('Pagination must be an object with fields');
                }
                for (let key in value) {
                    if (!value[key]) {
                        throw new Error(`Field ${key} in pagination cannot be empty`);
                    }else if(typeof value[key] !== "number"){
                        throw new Error(`Field ${key} in pagination must be a number`);
                    }
                }
                return true;
            })
    ], 
    getAllBlogs 
)

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