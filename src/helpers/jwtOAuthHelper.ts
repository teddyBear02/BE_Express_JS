import jwt from 'jsonwebtoken'
import { expressjwt as jwts } from 'express-jwt'
import { SECRET_KEY } from '../constants'
import { Request, Response } from 'express'

const maxAge : number =  3 * 24 * 60 * 60

export const createToken = (id : number | string | Object) =>{
    return jwt.sign(
        {id}, SECRET_KEY ,{
            expiresIn: maxAge,
            algorithm:"HS384",
        }
    )
}

export const tokenInfo = (req : Request, res : Response) =>{

    const token : string | undefined = req.headers['authorization'];

    if(token === undefined || token === null || token === "") {
        return res.status(401).send({
            message: "Unauthorized",
            status: 401
        })
    }
    
    const decodedToken : any = jwt.verify(token.substring(7,token.length), SECRET_KEY);

    return decodedToken
}   

export const algorithm = jwts({secret:SECRET_KEY, algorithms :["HS384"]})