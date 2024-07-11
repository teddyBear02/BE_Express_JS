// Import things here: 
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import routes from './routes/index'
import cookieParser from 'cookie-parser'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {swaggerOptions} from './swagger/swaggerOptions'

// Coding here: 
dotenv.config()
const app = express()
const port : string | undefined = process.env.PORT_SERVER || process.env.SUB_PORT_SERVER
const swaggerDocs = swaggerJsdoc(swaggerOptions);

mongoose.connect(`${process.env.DATABASE_MONGOSE_URL}`)
    .then(() => console.log('Connected to DB !!!'))
    .catch((err) => console.log(`Error: ${err}`))

const key : string | undefined | any = process.env.SESSION_SECRET_KEY    

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, async ()=>{
    console.log(`Server is running at http://localhost:${port}`)
    console.log(`API Swagger is running at http://localhost:${port}/api-docs`)
})


