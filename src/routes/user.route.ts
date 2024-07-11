import { Router } from 'express'
import { 
    getUser, 
    deleteUserById, 
    getUserById, 
    updateUser 
} from '../controllers/user.controller'

const router = Router()


router.get('/api/users', getUser)
router.delete('/api/users/:id', deleteUserById)
router.get('/api/users/:id', getUserById)
router.put('/api/users/:id', updateUser)

export default router