import mongoose from "mongoose";

const Schema = mongoose.Schema

const CommentSchema = new Schema(
    {
        CommentContent:{
            type: Schema.Types.String,
            length: 200
        },

        Author:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        Blog: {
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
