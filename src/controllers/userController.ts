import { Router,Request,Response } from 'express'
import { User } from '../models'
import { body, validationResult, matchedData } from 'express-validator'
import { hashPassword, comparePassword } from '../utils/helpers/authHelper'
import { createToken } from '../utils/helpers/jwtOAuthHelper'
import session from 'express-session'

const router = Router()

// Get information of users
router.get('/api/users', async (req , res)=>{
    try {
      const users = await User.find();
      res.status(200).send({
        users: users,
        message: "Get all users successfully !",
        status: 200
      })
    } catch (error: Error | undefined | any) {
      res.status(400).send(error.message)
    }
  }
)

// Create a new user
router.post('/api/users',
  [
    body("Name")
      .notEmpty()
      .withMessage("Username can't be empty")
      .isLength({min:5,max:32})
      .withMessage("Username from 5 to 32 characters")
      .isString(),
    body("Password")
      .notEmpty()
      .withMessage("Password can't be empty"),
    body("Email")
      .notEmpty()
      .withMessage("Filled this filed")
  ],

  async (req : Request , res : Response)=>{
    const result = validationResult(req)
    
    if(!result.isEmpty()){
      return res.status(400).send({
        error: result.array(),
        message:"Just fill empty filed",
        status:400
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
)

//Login to app
router.post(`/api/login`,
  [
    body("Email")
      .notEmpty()
      .withMessage("Email can't be empty"),
    body("Password")
      .notEmpty()
      .withMessage("Password can't be empty"),
  ],

  async (req : Request , res : Response)=>{
    
    const result = validationResult(req)

    if(!result.isEmpty()){
      return res.status(401).send({
        error: result.array(),
        message:"Just fill empty filed",
        status:401  
      })
    }

    const data = matchedData(req)
    try {
      const user = await User.findOne({Email:data.Email})
      if(user){
        const auth = comparePassword(data.Password, user.Password)
        const token = createToken(user._id)

        const userFilter = {          
          _id: user._id,
          Name: user.Name,
          Email: user.Email,
          Avatar: user.Avatar,
          Role: user.Role,
        }

        if(auth){
          
          

          return (res.status(200).json(
              {
                user: userFilter,
                token: token,
                message: "Login succeed !!!",
                status: 200
              }
            ),
              res.cookie("Session", (user._id).toString(),{
                path:"/",
                maxAge: 7*24*60*60
              })
          )
        }else{
          return res.status(401).json({
            message:"Wrong email or password !",
            status: 401
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
)

// Update a user
router.put('/api/users/:id', async (req,res)=>{
    const {
        body, 
        params:{id}
    } = req

    const users = await User.find()
    
    if(!id) return res.sendStatus(400) 

    const userIndex = users.findIndex((user)=> user.id === id)

    if(userIndex === -1){
      return res.sendStatus(404)
    } else{
      const userUpdate = await User.findByIdAndUpdate(id, body,{new:true});
      return res.status(201).send(userUpdate)
    }
  }
)

// DELETE a User :
router.delete('/api/users/:id', async(req,res) =>{
    const {params:{id}}= req

    const users = await User.find()

    if(!id) return res.sendStatus(400)
    
    const findUserIndex = users.findIndex((user)=> user.id === id)
    
    if(findUserIndex === -1) {
      return res.sendStatus(404)
    }else{
      await User.findByIdAndDelete(id)
      return res.status(200).send({
        message:"Delete record successfully !"
      })
    }
  }
)

// GET user by id
router.get('/api/users/:id', async(req,res)=>{
    const id = req.params.id
    if(!id) return res.status(400).send({
        message:"Bad Resquest,400"
    }) 

    const users = await User.find()

    const user = users.find((user)=>{
        return user.id === req.params.id
    })

    !user ?  

      res.status(404).send(
        {
          message: `Not found user with id: ${id} !`,
          status:404
        }
      ):  

      res.send(
        {
          user: user,
          message: "Get one user successfully !",
          status: 200
        }
      )
  }
)

router.post('/api/logout',
  (res : Response, req : Request)=>{
    
  }
)

export default router