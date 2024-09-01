import { body } from "express-validator";
import router from '../helpers/router.helper'
import { getComment, postComment, updateComment } from "../controllers/comment.controller";
import { algorithm } from "../helpers/jwtOAuthHelper";


router.get('/api/comments/:blog_id', algorithm, getComment)

router.post('/api/comments/:blog_id/:user_id', algorithm,
    [
        body("Comment")
        .notEmpty()
        .withMessage("Comment can't be empty !")
        .isLength({min:2})
        .withMessage("Blog content is more than 1 characters !")
    ],
    postComment
)

router.put('/api/comments/:id', algorithm, 
    [
        body("content")
        .notEmpty()
        .withMessage("Content can't be empty !")
        .isLength({min:2})
        .withMessage("Blog content is more than 1 characters !")
    ], 
    updateComment
)

export default router