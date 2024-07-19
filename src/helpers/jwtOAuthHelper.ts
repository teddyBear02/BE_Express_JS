import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const maxAge : number =  3 * 24 * 60 * 60

const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY

export const createToken = (id : number | string | Object) =>{
    return jwt.sign(
        {id}, SECRET_KEY ,{
            expiresIn: maxAge,
            algorithm:"HS384",
        }
    )
}

export const accessToken = () =>{
    
}

export const resetToken = () =>{
    
}