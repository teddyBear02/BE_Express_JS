import { Router } from "express";
import { body } from "express-validator";
import { getComment, postComment } from "../controllers/comment.controller";
import { algorithm } from "../helpers/jwtOAuthHelper";
const router = Router()
const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY


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

router.put('/api/comments/:id', algorithm, )

export default router