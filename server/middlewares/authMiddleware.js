import jwt from "jsonwebtoken"
import authModel from "../models/authModel.js"

const checkIsUserAuthenticated = async(req,res,next)=>{
const {authorization} = req.headers
//console.log(authorization)
if(authorization && authorization.startsWith("Bearer")) {
    try{
       const  token = authorization.split(" ")[1]
       //console.log(token)
        //verify token
        const decodedToken = jwt.verify(token,"SecretKey")
        //console.log("decodedToken" ,decodedToken)

        const userId = decodedToken.userID //access UserID from the decoded token
        //console.log("userId" , userId)

        //get user from token by using userId
        const userData = await authModel.findById(userId).select({password:0})
        if(!userData){
            throw new Error("user not found")
        }
        //console.log("userData" , userData)
        req.userId = userData._id;
        next();
    }
    catch(error){
        return res.status(404).json({message:error.message})  
    }
}
 
else{
    return res.status(404).json({message:"Unauthorized user"}) 
}
}
export default checkIsUserAuthenticated;
