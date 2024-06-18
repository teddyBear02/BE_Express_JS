import { Router } from 'express'
import { Blog, User } from '../models'
import { Request,Response } from 'express'
import { expressjwt as jwts } from 'express-jwt'
import jwt from "jsonwebtoken"
import { body, validationResult, matchedData } from 'express-validator'
import dotenv from 'dotenv'

dotenv.config()
const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY
const router = Router()

interface UserInfo{
  id: string
}

// get all blogs:(Done)
router.get('/api/blogs',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),

  async (req, res)=>{

    try {
      const blogs = await Blog.find();
      res.status(200).send({
        blogs: blogs,
        message: "Get all blogs successfully !",
        status: 200
      })
    } catch (error : Error | undefined | any) {
      res.status(400).send(error.message)
    }
  }
)

//Get all blogs by user id: 
router.get('/api/blogs/user/:user_id',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  
  async (req, res)=>{
    const users  = await User.find()
    
    const user = users.find((user)=>{
      return user.id === req.params.user_id
    })

    if(!user){
      return res.status(404).send({
        message:"Not found user",
        status: 404
      })
    }else{
      try {
        const blogs = await Blog.find({Author:user.id});

        const userFilter = {
          _id: user._id,
          Name: user.Name,
          Email: user.Email,
          Avatar: user.Avatar,
          Role: user.Role,
        }

        res.status(200).send({
          user: userFilter,
          blogs: blogs,
          message: "Get all blogs successfully !",
          status: 200
        })
      } catch (error : Error | undefined | any) {
        res.status(400).send(error.message)
      }
    }
  }
)

// create new blog (Done)
router.post('/api/blog',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  [
    body("Content")
      .notEmpty()
      .withMessage("Content can't be empty !")
      .isLength({min:2})
      .withMessage("Blog content is more than 1 characters !")
  ],
  async (req:Request, res:Response)=>{ 

    const token : string | any = req.headers['authorization'];

    const decodedToken : UserInfo | Object | any = jwt.verify(token.substring(7,token.length), SECRET_KEY);

    const userCreate : any = await User.findOne({_id:decodedToken.id})

     const userFilter = {
      _id: userCreate._id,
      Name: userCreate.Name,
      Email: userCreate.Email,
      Avatar: userCreate.Avatar,
      Role: userCreate.Role,
    }
    
    const result = validationResult(req)

    if(!result.isEmpty()){
        return res.status(400).send({
          error: result.array(),
          message:"Just fill empty filed",
          status:400
        })
    }

    const data = matchedData(req)
    const newBlog = new Blog(
      {
        Content: data.Content,
        Author: userFilter
      }
    )
    try {
        const blog = await newBlog.save()
        return res.status(201).send({
          user : userFilter,
          blog: blog,
          message: 'Create new blog successfully !',
          status: 201
        })  
    } catch (error) {
        return res.status(400).send(error)
    }
  }
)

// Update a poster: 
router.put('/api/blogs/:id',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  async (req,res)=>{

    const token : string | any = req.headers['authorization'];

    const decodedToken : UserInfo | Object | any = jwt.verify(token.substring(7,token.length), SECRET_KEY);

    const userCreate = await User.findOne({_id:decodedToken.id})

    const {
        body, 
        params:{id}
    } = req

    const blogs = await Blog.find({Author:userCreate?._id})

    const posterIndex = blogs.findIndex((blog)=> blog.id === id)

    if(posterIndex === -1){
      return res.status(404).send(
        {
          message: `Can't found the poster !!!`,
          status:404
        }
      )
    } else{
      const posterUpdate = await Blog.findByIdAndUpdate(id, body,{new:true});
      return res.status(200).send(
        {
          poster: posterUpdate,
          message: "Update poster successfully !!!",
          status: 200
        }
      )
    }
  }
)

router.delete('/api/blogs/:id',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  async(req,res) =>{
    const {params:{id}}= req

    const token : string | any = req.headers['authorization'];

    const decodedToken : UserInfo | Object | any = jwt.verify(token.substring(7,token.length), SECRET_KEY);

    const userCreate = await User.findOne({_id:decodedToken.id})

    const blogs = await Blog.find({Author: userCreate?._id})
    
    const posterIndex = blogs.findIndex((blog)=> blog.id === id)
    
    if(posterIndex === -1) {
      return res.status(404).send(
        {
          message: "Can't found the poster !!!",
          status: 404
        }
      )
    }else{
      await Blog.findByIdAndDelete(id)
      return res.status(200).send(
        {
          message:"Delete record successfully !",
          status:200
        }
      )
    }
  }
)

// GET a poster by id :

router.get('/api/blogs/:id',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  async(req,res)=>{

  const id = req.params.id

  if(!id) return res.status(400).send({
      message:"Bad Resquest,400"
  }) 

  const blogs = await Blog.find()

  const blog = blogs.find((blog)=>{
      return blog.id === req.params.id
  })

  !blog ?  

    res.status(404).send(
      {
        message: `Not found blog with id: ${id} !`,
        status:404
      }
    ):  

    res.send(
      {
        blog: blog,
        message: "Get one blog successfully !",
        status: 200
      }
    )
})

export default router