import { login, resgister, logout } from '../controllers/auth.controller'
import { body } from 'express-validator'
import { Router } from 'express'

const router = Router()

// [POST] - Login

router.post(`/api/login`,
    [
      body("Email")
        .notEmpty()
        .withMessage("Email can't be empty"),
      body("Password")
        .notEmpty()
        .withMessage("Password can't be empty"),
    ],
    login
)

// [POST] - Register

router.post('/api/register',
    [
        body("Name")
        .notEmpty()
        .withMessage("Username can't be empty")
        .isLength({ min: 5, max: 32 })
        .withMessage("Username from 5 to 32 characters")
        .isString(),
        body("Password")
        .notEmpty()
        .withMessage("Password can't be empty"),
        body("Email")
        .notEmpty()
        .withMessage("Filled this filed")
    ],
    resgister
)

// [GET] - Logout

router.get('/api/logout',logout)

export default router