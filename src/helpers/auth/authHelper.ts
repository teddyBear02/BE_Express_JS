import bcrypt from "bcrypt"

const saltRounds : number = 10

export const hashPassword = ( password : string | Buffer ) =>{
    const salt =  bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password , salt)
}

export const comparePassword = (plain : string | Buffer, hashed : string | any) =>{
    return bcrypt.compareSync(plain , hashed)
}