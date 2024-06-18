import mongoose from "mongoose"

const Schema = mongoose.Schema

const BlogSchema = new Schema(
    {
        Content: { 
            type: Schema.Types.String, 
            required: true,
            length: 100000
        },

        Image:{
            type: Schema.Types.String,
            default: null
        },

        Tag:{
            type: Schema.Types.Array,
            default: []
        },

        Author:{
            type: Schema.Types.ObjectId,
            ref: "User"
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
