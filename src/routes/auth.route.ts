import { login, resgister, logout } from '../controllers/auth.controller'
import { body } from 'express-validator'
import router from '../helpers/router.helper'

// [POST] - Login

router.post(`/api/login`,
    [
      body("email")
        .notEmpty()
        .withMessage("Email can't be empty"),
      body("password")
        .notEmpty()
        .withMessage("Password can't be empty"),
    ],
    login
)

// [POST] - Register

router.post('/api/register',
    [
        body("name")
        .notEmpty()
        .withMessage("Username can't be empty")
        .isLength({ min: 5, max: 32 })
        .withMessage("Username from 5 to 32 characters")
        .isString(),
        body("password")
        .notEmpty()
        .withMessage("Password can't be empty"),
        body("email")
        .notEmpty()
        .withMessage("Filled this filed")
    ],
    resgister
)

// [GET] - Logout

router.get('/api/logout',logout)

export default router