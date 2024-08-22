import { Blog, User, Comments } from '../schemas'
import { Request , Response } from 'express'
import { validationResult, matchedData } from 'express-validator'

// [GET] - Comment by id
  
export const getComment = async (req:Request, res:Response)=>{
  const blogs  = await Blog.find()
  
  const blog = blogs.find((blog)=>{
    return blog.id === req.params.blog_id
  })

  if(!blog){
    return res.status(404).send({
      message:"Not found blog",
      status: 404
    })
  }else{
    try {
      const comments = await Comments.find({ BlogId: blog.id});
      res.status(200).send({
        result: comments,
        message: "Get all comments successfully !",
        status: 200
      })
    } catch (error : Error | undefined | any) {
      res.status(400).send(error.message)
    }
  }
}


//[POST] - Comment 
  
export const postComment = async (req : Request, res : Response)=>{ 

  const userComment : any = await User.findOne({_id:req.params.user_id})

  const blog : any = await Blog.findOne({_id: req.params.blog_id})
  
  const result = validationResult(req)

  if(!result.isEmpty()){
    return res.status(400).send({
      error: result.array(),
      message:"Just fill empty filed",
      status:400
    })
  }
  
  const data = matchedData(req)

  const newComment = new Comments(
    {
      commentContent: data.Comment,
      authorId: userComment._id,
      blogId: blog._id
    }
  )
  
  try {
      blog.Comment.push(newComment)
      await blog.save()
      const comment = await newComment.save()
      return res.status(201).send(
        {
          result: comment,
          message: 'Create new comment successfully !',
          status: 201
        }
      )  
  } catch (error) {
      return res.status(400).send(error)
  }
}


// [UPDATE] - Comment: 


