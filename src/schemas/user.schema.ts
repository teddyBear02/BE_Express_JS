import mongoose from "mongoose"

const Schema = mongoose.Schema

const UsersSchema = new Schema(
    {
        name: { 
            type: Schema.Types.String,
            unique: false,
            require: true,
        },

        password:{
            type : Schema.Types.String,
            require : true,
        },

        email:{
            type:Schema.Types.String,
            unique: true,
            require: true
        },

        avatar:{
            type: Schema.Types.String,
            default: null
        },

        role:{
            type: Schema.Types.Number, 
            default: 0,
            require:true
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

const User = mongoose.model('User', UsersSchema)

export default User
