import mongoose from "mongoose"

const Schema = mongoose.Schema

const BlogSchema = new Schema(
    {
        content: { 
            type: Schema.Types.String, 
            required: true,
            length: 100000
        },

        image:{
            type: Schema.Types.String,
            default: null
        },

        comment:{
            type: Schema.Types.Array,
            default: [],
            ref: "Comments"
        },

        author:{
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true
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


const Blog = mongoose.model('Blog', BlogSchema)

export default Blog
