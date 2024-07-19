import {  Request, Response } from 'express'
import { Blog, User } from '../schemas'

//* [GET] - All users

export const getUser =  async (req: Request, res: Response) => {
    try {
      const users = await User.find();

      const usersReturn = 
        users.map( (user)=>{
          const userReturn = {
            id: user._id,
            name: user.Name,
            email: user.Email,
            avatar: user.Avatar,
            role: user.Role,
            created_at : user.createdAt,
            updated_at: user.updatedAt 
          }
          return userReturn
        })
      
      res.status(200).send({
        users: usersReturn,
        message: "Get all users successfully !",
        status: 200
      })
    } catch (error: Error | undefined | any) {
      res.status(400).send(error.message)
    }
  }


//! [DELETE] User by id - DON'T USE THIS ROUTE :

export  const deleteUserById = async (req :Request, res : Response) => {
    const { params: { id } } = req

    const users = await User.find()

    if (!id) return res.sendStatus(400)

    const findUserIndex = users.findIndex((user) => user.id === id)

    if (findUserIndex === -1) {
      return res.sendStatus(404)
    } else {
      await User.findByIdAndDelete(id)
      return res.status(200).send({
        message: "Delete record successfully !"
      })
    }
  }


// [GET] - User by id

export const getUserById = async (req :Request, res : Response) => {
    const id = req.params.id
    if (!id) return res.status(400).send({
      message: "Bad Resquest,400"
    })

    const user = await User.findOne({_id: req.params.id})

    const blogs = await Blog.find({Author: user?._id})


    const userReturn = {
      _id: user?._id,
      name: user?.Name,
      Email: user?.Email,
      Avatar: user?.Avatar,
      Role: user?.Role,
      Blogs: blogs
    }

    !user ?

      res.status(404).send(
        {
          message: `Not found user with id: ${id} !`,
          status: 404
        }
      ) :

      res.send(
        {
          user: userReturn,
          message: "Get one user successfully !",
          status: 200
        }
      )
  }


 // [UPDATE] - User

export const updateUser =  async (req: Request, res: Response) => {
    const {
      body,
      params: { id }
    } = req

    const users = await User.find()

    if (!id) return res.sendStatus(400)

    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) {
      return res.sendStatus(404)
    } else {
      const userUpdate = await User.findByIdAndUpdate(id, body, { new: true });
      return res.status(201).send(userUpdate)
    }
  }


