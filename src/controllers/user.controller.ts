import {  Request, Response } from 'express'
import { User } from '../schemas'
import { matchedData, validationResult } from 'express-validator'
import jwt from "jsonwebtoken" 
import { SECRET_KEY } from '../constants'

//* [POST] - Seacrh user: 

export const getUser =  async (req: Request, res: Response) => {

  const configSearch = matchedData(req)

  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(400).send(
        {
            error: result.array(),
            status: 400
        }
    )
  }

  const regex = new RegExp(configSearch.search.keyword,'i')

  const users = await User.find({
    $or : [
      {name: { $regex :  regex}}, 
      { email: { $regex :  regex}}
    ],
  })
  .skip((configSearch.pagination.pageNumber-1) * configSearch.pagination.pageSize)
  .limit(configSearch.pagination.pageSize);

  try {
    const usersReturn = 
      users.map( (user)=>{
        const userReturn = {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          created_at : user.createdAt,
          updated_at: user.updatedAt 
        }
        return userReturn
      })
    
    res.status(200).send({
      result: usersReturn,
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

  try {

    await User.findByIdAndDelete(id)

    return res.status(200).send({
      message: "Delete record successfully !",
      status: 200
    })

  } catch (error) {

    return res.status(404).send({
      message: "User not found !",
      status: 404
    })

  }
  
}

// [GET] Get user's information: 

export const getUserInfo = async (req :Request, res : Response) => {

  const token : any | string = req.headers['authorization'];

  const decodedToken : any = jwt.verify(token.substring(7,token.length), SECRET_KEY);

  const user : any = await User.findById({_id : decodedToken.id})
  
  try {

    const userReturn = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    }

    return res.send(
      {
        result: userReturn,
        message: "Get one user successfully !",
        status: 200
      }
    )

  } catch (error) {
    return  res.status(400).send(
      {
        message: `Error : ${error}`,
        status: 400
      }
    ) 
  }
}



// [GET] - User by id

export const getUserById = async (req :Request, res : Response) => {

  const { params : {id} } = req
  
  try {
    const user = await User.findById({ _id : id })

    const userReturn = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      avatar: user?.avatar,
      role: user?.role
    }

    return res.send(
      {
        result: userReturn,
        message: "Get one user successfully !",
        status: 200
      }
    )

  } catch (error) {
    return  res.status(404).send(
      {
        message: `Not found user with id: ${id} !`,
        status: 404
      }
    ) 
  }
}


 // [UPDATE] - User

export const updateUser =  async (req: Request, res: Response) => {
  const {
    body,
    params: { id }
  } = req

  try {
    const userUpdate = await User.findByIdAndUpdate(id, body, { new: true });
    return res.status(201).send({
      result: userUpdate,
      message: "Update successfully !!!",
      status: 201
    })
  } catch (error) {
    return res.status(404).send({
      message: "Not found",
      status: 404
    })
  }
}