import { body } from "express-validator";
import router from '../helpers/router.helper'
import { getComment, postComment, updateComment } from "../controllers/comment.controller";
import { algorithm } from "../helpers/jwtOAuthHelper";


router.post('/api/comments/:blog_id', algorithm,
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
    getComment
)

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