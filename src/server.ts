// Import things here: 
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import session from 'express-session'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
import { PORT } from './constants'

// Coding here: 

const app = express()

mongoose.connect(`${process.env.DATABASE_MONGOSE_URL}`)
    .then(() => console.log('Connected to DB !!!'))
    .catch((err) => console.log(`Error: ${err}`))

const key : any  = process.env.SESSION_SECRET_KEY    

app.use(cors({
    origin: process.env.END_POINT_URL,
    credentials: true
}))

app.use(cookieParser());
app.use(session(
    {
        secret: key,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true
        }
    }
))

app.use(express.json())
app.use(routes)
app.listen(PORT, async ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})


