import dotenv from 'dotenv'
dotenv.config();
import  express  from "express";
const app =express() //instance of express
import connectDB from "./config/db.js";
import cors from 'cors'

app.use(cors());
app.use(express.json())
connectDB();
import authRoute from './routes/authRoute.js'


//Routes
app.use('/api/auth' ,authRoute)

const port=5000 //backend will run on this port
app.listen(port,()=>{
    console.log(`API is running on http://localhost:${port}`)
})
