import { Router } from 'express'
import { Blog, User, Comments } from '../schemas'
import { Request,Response } from 'express'
import { expressjwt as jwts } from 'express-jwt'
import jwt from "jsonwebtoken"
import { body, validationResult, matchedData } from 'express-validator'

const SECRET_KEY : string | any = process.env.TOKEN_SECRET_KEY
const router = Router()

interface UserInfo{
  id: string
}

// [GET] - Comment

router.get('/api/comments/:blog_id',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  
  async (req, res)=>{
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
          comments: comments,
          message: "Get all comments successfully !",
          status: 200
        })
      } catch (error : Error | undefined | any) {
        res.status(400).send(error.message)
      }
    }
  }
)

//[POST] - Comment 

router.post('/api/comments/:blog_id/:user_id',
  jwts({secret:SECRET_KEY, algorithms :["HS256"]}),
  [
    body("Comment")
      .notEmpty()
      .withMessage("Comment can't be empty !")
      .isLength({min:2})
      .withMessage("Blog content is more than 1 characters !")
  ],
  async (req:Request, res:Response)=>{ 

    const userComment:any = await User.findOne({_id:req.params.user_id})

    const blog :any = await Blog.findOne({_id: req.params.blog_id, Author: req.params.user_id})
    
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
        CommentContent: data.Comment,
        AuthorId: userComment._id,
        BlogId: blog._id
      }
    )

    try {
        // await blog.Comment.save(newComment)
        const comment = await newComment.save()

        return res.status(201).send({
        comment: comment,
        message: 'Create new comment successfully !',
        status: 201
        })  
    } catch (error) {
        return res.status(400).send(error)
    }
  }
)

// [UPDATE] - Comment: 

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

    const blogs = await Blog.find()

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
      return res.status(201).send(
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

    const users = await Blog.find()
    
    const findUserIndex = users.findIndex((user)=> user.id === id)
    
    if(findUserIndex === -1) {
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

// [GET] - a poster by id :

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