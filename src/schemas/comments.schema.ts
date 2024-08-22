import mongoose from "mongoose";

const Schema = mongoose.Schema

const CommentSchema = new Schema(
    {
        content:{
            type: Schema.Types.String,
            length: 200
        },

        authorId:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        blogId: {
            type: Schema.Types.ObjectId,
            ref: "Blog"
        },

        createdAt: {
            type: Schema.Types.Date, 
            default: Date.now
        },

        updatedAt: {
            type: Schema.Types.Date, 
            default: Date.now
        }
    }
)

const Comments = mongoose.model('Comments',CommentSchema)

export default Comments
