// Import things here: 
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import routes from './routes/index'

// Coding here: 
dotenv.config()
const app = express()


mongoose.connect(`${process.env.DATABASE_MONGOSE_URL}`)
    .then(() => console.log('Connected to DB !!!'))
    .catch((err) => console.log(`Error: ${err}`))

const key : string | undefined | any = process.env.SESSION_SECRET_KEY    
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(session(
    {
        secret: key,
        resave: false,
        saveUninitialized: true
    }
))
app.use(express.json())
app.use(routes)

const port : string | number = process.env.PORT_SERVER || 3000
app.listen(port, async ()=>{
    console.log(`Server is running at http://localhost:${port}`)
})