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
            .bail()
            .custom(value => {
                if (typeof value !== 'object' ) {
                    throw new Error('Search must be an object with fields');
                }
                for (let key in value) {
                    if (key !== 'keyword' && !value[key]) {
                        throw new Error(`Field ${key} in search cannot be empty`);
                    }
                }
                return true;
            }),
        body("pagination")
            .notEmpty()
            .bail()
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
    getUser
)

router.delete('/api/users/:id', algorithm, deleteUserById)

router.get('/api/users/:id', algorithm, getUserById)

router.put('/api/users/:id', algorithm, updateUser)

export default router