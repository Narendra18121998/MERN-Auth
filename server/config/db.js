import mongoose from "mongoose";

const connectDB = async()=>{
    const username = process.env.Db_Username
    const password = process.env.Db_Password
    const url = `mongodb+srv://${username}:${password}@cluster0.z6b3rvx.mongodb.net/mern-auth-project?retryWrites=true&w=majority&appName=Cluster0`
    const res = await mongoose.connect(url)
    if(res){
        console.log("Connection successful to database")
    }
    else{
        console.log("Connection failed to database")
    }
}
export default connectDB;

