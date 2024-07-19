import { Request, Response } from 'express'
import { validationResult, matchedData } from 'express-validator'
import { comparePassword, hashPassword } from '../helpers/authHelper'
import { createToken } from '../helpers/jwtOAuthHelper'
import { User } from '../schemas'


//_________________LOGIN____________________//

export const login = async (req: Request, res: Response) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
    return res.status(401).send(
            {
                error: result.array(),
                message: "Just fill empty filed",
                status: 401
            }
        )
    }

    const data = matchedData(req)
    const user = await User.findOne({ Email: data.Email })

    try {
        if (user) {
            const auth = comparePassword(data.Password, user.Password)
            const token = createToken(user._id)

            const userFilter = {
            _id: user._id,
            name: user.Name,
            email: user.Email,
            avatar: user.Avatar,
            role: user.Role,
            }

            if (auth) {

            return (
                res.status(200).json(
                    {
                        user: userFilter,
                        message: "Login succeed !!!",
                        status: 200,
                        token: token
                    }
                )
            )
            } else {
                return res.status(401).json({
                    message: "Wrong email or password !",
                    status: 401
                })
            }
        }else{
            return res.status(401).json({
                message: "Wrong email or password !",
                status: 401
            })
        }
    } catch (error) {
        console.log(error)
    }
}


//__________________REGISTER____________________//

export const resgister = async (req: Request, res: Response) => {
    
    const result = validationResult(req)
    if (!result.isEmpty()) {
        return res.status(400).send({
            error: result.array(),
            message: "Just fill empty filed",
            status: 400
        })
    }

    const data = matchedData(req)
    data.Password = hashPassword(data.Password)
    const newUser = new User(data)

    try {
    const saveUser = await newUser.save()

    const userFilter = {
        _id: saveUser._id,
        Name: saveUser.Name,
        Email: saveUser.Email,
        Avatar: saveUser.Avatar,
        Role: saveUser.Role,
    }

    return res.status(201).send({
        user: userFilter,
        message: 'Create new user successfully !',
        status: 201
    })
    } catch (error) {
    return res.status(400).send({
        error,
        message: "Create a new user failed !!!",
        status: 400
    })
    }
}

  
//__________________LOGOUT____________________//

export const logout = async (req:Request, res: Response) => {
    req.session.destroy((err) => {
    if (err) {
        console.error('Failed to destroy session:', err);
        return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logout successful', status: 200 });
    });
}
