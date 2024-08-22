import jwt from 'jsonwebtoken'
import { expressjwt as jwts } from 'express-jwt'
import { SECRET_KEY } from '../constants'

const maxAge : number =  3 * 24 * 60 * 60

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

export const algorithm = jwts({secret:SECRET_KEY, algorithms :["HS384"]})