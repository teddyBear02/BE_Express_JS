import { Router } from 'express'
import { algorithm } from '../helpers/jwtOAuthHelper'
import { 
    getUser, 
    deleteUserById, 
    getUserById, 
    updateUser 
} from '../controllers/user.controller'

const router = Router()


router.get('/api/users', algorithm, getUser)
router.delete('/api/users/:id', algorithm, deleteUserById)
router.get('/api/users/:id', algorithm, getUserById)
router.put('/api/users/:id', algorithm, updateUser)

export default router