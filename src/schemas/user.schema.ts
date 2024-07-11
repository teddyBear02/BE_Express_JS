import mongoose from "mongoose"

const Schema = mongoose.Schema

const UsersSchema = new Schema(
    {
        Name: { 
            type: Schema.Types.String,
            unique: false,
            require: true,
        },

        Password:{
            type : Schema.Types.String,
            require : true,
        },

        Email:{
            type:Schema.Types.String,
            unique: true,
            require: true
        },

        Avatar:{
            type: Schema.Types.String,
            default: null
        },

        Role:{
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
