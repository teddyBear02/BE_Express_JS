import { Blog, User, Comments } from '../schemas'
import { Request, Response } from 'express'
import { validationResult, matchedData } from 'express-validator'
import { tokenInfo } from '../helpers/jwtOAuthHelper'

//*_______________ [POST] - all blogs: __________________//

export const getAllBlogs = async (req: Request, res: Response)=>{

  const request  = matchedData(req)

  const { pagination } = request

  const result = validationResult(req)

  if (!result.isEmpty()) {
    return res.status(400).send(
        {
            error: result.array(),
            status: 400
        }
    )
  }

  const blogs = await 
    Blog.find({})
        .skip((pagination.pageNumber - 1) * pagination.pageSize)
        .limit(pagination.pageSize).exec()

  const totalRecord = await
    Blog.countDocuments({})
      .then((count)=>{
        return count
      })
      .catch(err => {
        return err
      });

  const totalPage = Math.floor(totalRecord /  request.pagination.pageSize) + 1

  try {
    res.status(200).send({
      result: blogs,
      totalPage: totalPage,
      totalRecord: totalRecord,
      message: "Get all blogs successfully !",
      status: 200
    })
  } catch (error : Error | undefined | any) {
    res.status(400).send(error.message)
  }
}

//*_______________ [GET] - All blogs by user id : __________________//

export const getBlogByUserId = async (req: Request, res: Response)=>{

  const { params } = req

  try {
    const blogs = await Blog.find({author: params.user_id}).exec();

    res.status(200).send({
      result: blogs,
      message: "Get all blogs successfully !",
      status: 200
    })
  } catch (error : Error | undefined | any) {
    res.status(400).send(error.message)
  }
}


//*_______________ [POST] - Blog : __________________//


export const createNewPost = async (req:Request, res:Response)=>{ 

  const decodedToken : any = tokenInfo(req,res)

  const userCreate : any = await User.findOne({_id:decodedToken.id})
  
  const result = validationResult(req)

  const data = matchedData(req)
  
  if(!result.isEmpty()){
      return res.status(400).send({
        error: result.array(),
        message:"Just fill empty filed",
        status:400  
      })
  }

  try {

      const newBlog = new Blog(
        {
          content: data.content,
          author: userCreate._id
        }
      )

      const blog = await newBlog.save()

      return res.status(201).send({
        result: blog,
        message: 'Create new blog successfully !',
        status: 201
      })  
  } catch (error) {
      return res.status(400).send({
        message: error,
        status: 400
      })
  }
}


//*_______________ [PUT] - Blog by id: __________________//


export const updatePost = async (req:Request, res:Response)=>{
  
  const decodedToken : any = tokenInfo(req,res)

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

  const decodedToken : any = tokenInfo(req,res)

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
    name: userCreated?.name,
    email: userCreated?.email,
    avatar: userCreated?.avatar,
    role: userCreated?.role,
  }

  const blogReturn = {
    _id: blog?._id,
    content: blog?.content,
    image : blog?.image,
    author: userReturn,
    comments: comments,
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
