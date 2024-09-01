import router from '../helpers/router.helper'
import { algorithm } from '../helpers/jwtOAuthHelper'
import { 
    getUser, 
    deleteUserById, 
    getUserById, 
    updateUser 
} from '../controllers/user.controller'
import { body } from 'express-validator'


router.post('/api/users', algorithm, 
    [
       body("search")
        .notEmpty()
        .withMessage("Do not empty")
    ],
    getUser
)
router.delete('/api/users/:id', algorithm, deleteUserById)
router.get('/api/users/:id', algorithm, getUserById)
router.put('/api/users/:id', algorithm, updateUser)

export default router