import bcrypt from "bcrypt"

const saltRounds : number = 10

export const hashId = (sessionsId : string | Buffer ) =>{
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(sessionsId , salt)
}
