import { Blog, User, Comments } from '../schemas'
import { Request, Response } from 'express'
import jwt from "jsonwebtoken"
import { validationResult, matchedData } from 'express-validator'

const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY
interface UserInfo{
  id: string
}

//*_______________ [GET] - all blogs: __________________//

export const getAllBlogs = async (req: Request, res: Response)=>{
  const blogs = await Blog.find();

  //
  const responseData = await Promise.all(
    blogs.map(async (blog) => {

      const blogReturn = {
        _id: blog._id,
        content: blog.content,
        image: blog.image,
        comment: blog.comment,
        author: blog.author,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }
      return blogReturn;
    })
  )

  try {
    res.status(200).send({
      result: responseData,
      message: "Get all blogs successfully !",
      status: 200
    })
  } catch (error : Error | undefined | any) {
    res.status(400).send(error.message)
  }
}

//*_______________ [GET] - All blogs by user id : __________________//

export const getBlogByUserId = async (req: Request, res: Response)=>{
  
  const user  = await User.findOne({_id: req.params.user_id}).exec()

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
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      }

      res.status(200).send({
        user: userFilter,
        result: blogs,
        message: "Get all blogs successfully !",
        status: 200
      })
    } catch (error : Error | undefined | any) {
      res.status(400).send(error.message)
    }
  }
}


//*_______________ [POST] - Blog : __________________//


export const createNewPost = async (req:Request, res:Response)=>{ 

  const token : any | string = req.headers['authorization'];

  const decodedToken : any = jwt.verify(token.substring(7,token.length), SECRET_KEY);

  const userCreate : any = await User.findOne({_id:decodedToken.id})

  const userFilter = {
    _id: userCreate._id,
    name: userCreate.name,
    email: userCreate.email,
    avatar: userCreate.avatar,
    role: userCreate.role,
    blog: userCreate.blog
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

  console.log(data)
  const newBlog = new Blog(
    {
      content: data.content,
      author: userFilter
    }
  )

  try {
      const blog = await newBlog.save()
      return res.status(201).send({
        result: blog,
        message: 'Create new blog successfully !',
        status: 201
      })  
  } catch (error) {
      return res.status(400).send(error)
  }
}


//*_______________ [PUT] - Blog by id: __________________//


export const updatePost = async (req:Request, res:Response)=>{
  
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
        result: posterUpdate,
        message: "Update poster successfully !!!",
        status: 200
      }
    )
  }
}


//*_______________ [DELETE] - Blog by id: __________________//


export const deletePostById =  async(req: Request, res: Response) =>{
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

//*_______________ [GET] - Blog by id: __________________//


export const getPostById =  async(req: Request, res: Response)=>{

  const id = req.params.id

  if(!id) return res.status(400).send({
      message:"Bad Resquest,400"
  }) 

  const blog = await Blog.findOne({_id: id})

  const comments = await Comments.find({BlogId:id})

  const userCreated = await User.findOne({_id:blog?.author})

  const userReturn = {
    _id:userCreated?._id,
    Name: userCreated?.name,
    Email: userCreated?.email,
    Avatar: userCreated?.avatar,
    Role: userCreated?.role,
  }

  const blogReturn = {
    _id: blog?._id,
    Content: blog?.content,
    Image : blog?.image,
    Author: userReturn,
    Comments: comments,
    createAt: blog?.createdAt,
    updateAt: blog?.updatedAt
  }

  !blog ?  

    res.status(404).send(
      {
        message: `Not found blog with id: ${id} !`,
        status:404
      }
    ):  
    res.send(
      {
        result: blogReturn,
        message: "Get one blog successfully !",
        status: 200
      }
    )
}
