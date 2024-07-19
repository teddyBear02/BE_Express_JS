import { Router } from "express";
import { expressjwt as jwts } from 'express-jwt'
import { body } from "express-validator";
import { getComment, postComment } from "../controllers/comment.controller";
const router = Router()
const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY


router.get('/api/comments/:blog_id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),
    getComment
)

router.post('/api/comments/:blog_id/:user_id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),[
        body("Comment")
        .notEmpty()
        .withMessage("Comment can't be empty !")
        .isLength({min:2})
        .withMessage("Blog content is more than 1 characters !")
    ],
    postComment
)

router.put('/api/comments/:id',
    jwts({secret:SECRET_KEY, algorithms :["HS384"]}),)

export default router