import authModel from '../models/authModel.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const userRegistration=async(req,res)=>{
    const {name,email,password} = req.body
    try {
        if(name && email && password){
            const isUser = await authModel.findOne({email:email})
            if(isUser){
                return res.status(404).json({message:"user already exists"})
            }
            else{
                //password hashing
                const genSalt = await bcryptjs.genSalt(10)
                const hashedPassword = await bcryptjs.hash(password,genSalt)

                //creating a new user
                const newUser= authModel({
                    name:name,
                    email:email,
                    password:hashedPassword
                })

                //saving the newUser in the database
                const savedUser = await newUser.save();
                if(savedUser){
                    return res.status(200).json({message:"Registration Successful" ,user:savedUser})
                }
            }
        }
        else{
            return res.status(404).json({message:"all fields are required"})
        }
    } 
    catch (error) {
        return res.status(404).json({message:error.message})    
    }
}

const userLogin=async(req,res)=>{
    const {email,password}=req.body;
    try {
        if(email && password){
            const isUser = await authModel.findOne({email:email})
            if(isUser){
                //compare password
                const passMatch = await bcryptjs.compare(password, isUser.password)
                if(passMatch){
                    //generate token
                    const token = jwt.sign({userID:isUser._id} ,"SecretKey" ,{expiresIn:"2d"})
                    return res.status(200).json({message:"Login Successful" ,token , user:isUser.name})
                }
                else{
                    return res.status(404).json({message:"Invalid Credentials"})
                }
            }
            else{
                return res.status(404).json({message:"user is not registered"})
            }
        }
        else{
            return res.status(404).json({message:"all fields are required"})
        }
        
    } 
    catch (error) {
        console.log(error)
        return res.status(404).json({message:error.message}) 
    }
}

const changePassword=async(req,res)=>{
    const{newpassword,confirmpassword} = req.body
    try {
        if(newpassword && confirmpassword){
            if(newpassword===confirmpassword){
                //hashing of new password
                const genSalt = await bcryptjs.genSalt(10)
                const hashedPassword = await bcryptjs.hash(newpassword,genSalt)
                await authModel.findByIdAndUpdate(req.userId , {password:hashedPassword} )
                return res.status(200).json({message:"password changed successfully"})
            }
            else{
                return res.status(404).json({message:"newpassword and confirmpassword does not match"})
            }
        }
        else{
            return res.status(404).json({message:"all fields are required"})
        }
    } 
    catch (error) {
        return res.status(404).json({message:error.message})  
    }
}

const forgetPassword=async(req,res)=>{
    const {email} = req.body
    try {
        if(email){
            const isUser=await authModel.findOne({email:email})
            if(isUser){
                //generate token
                const secretkey=isUser._id + "SecretKey"
                const token = jwt.sign({userID:isUser._id} , secretkey,{expiresIn:"5m"})

                const link=`http://localhost:3000/user/reset/${isUser._id}/${token}`
                
                //email sending
                const transport = nodemailer.createTransport({
                    service:"gmail",
                    host:"smtp.gmail.com",
                    port:465,
                    auth:{
                        user:process.env.EMAIL,
                        pass:process.env.PASSWORD
                    }
                })

                const mailOptions={
                    from:process.env.EMAIL,
                    to:email,
                    subject:"Password Reset Request",
                    text: `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href=${link}
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                   
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`,
            html: `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                   
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            We cannot simply send you your old password. A unique link to reset your
                                            password has been generated for you. To reset your password, click the
                                            following link and follow the instructions.
                                        </p>
                                        <a href="${link}"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                            Password</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                   
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`,
                }
                transport.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        return res.status(404).json({message:"Error"})
                    }
                    else{
                        return res.status(200).json({message:"Email sent"})
                    }
                })
            }

            else{
                return res.status(404).json({message:"user not found"})
            }
        }

        else{
            return res.status(404).json({message:"email is required"})
        }
    } 

    catch (error) {
        return res.status(404).json({message:error.message})    
    }

}

const forgetPasswordEmail=async(req,res)=>{
    const{newpassword,confirmpassword}=req.body
    const{id,token}=req.params

    try {
        if(newpassword && confirmpassword && id && token){
            if(newpassword===confirmpassword){
                //token verification if it did't expire because we have set 5min limit
                const isUser = await authModel.findById(id)
                const secretkey=isUser._id+"SecretKey"
                const isValid = await jwt.verify(token,secretkey)
                //console.log(isValid)
                if(isValid){
                    
                    //password hashing
                    const genSalt = await bcryptjs.genSalt(10)
                    hashedPassword = await bcryptjs.hash(newpassword,genSalt)

                    const isSuccess = await authModel.findByIdAndUpdate(isUser._id ,{
                        $set:{password:hashedPassword}
                    }) 

                    if(isSuccess){
                        return res.status(200).json({message:"Password has been changed"})
                    }
                }
                else{
                    return res.status(404).json({message:"Link has been expired"})
                }

            }
            else{
                return res.status(404).json({message:"newPassword and confirmPassword are not same"})
            }
        }
        else{
            return res.status(404).json({message:"all fields are required"})
        }
    } 
    catch (error) {
        return res.status(404).json({message:error.message})
    }

}
export {userRegistration,userLogin,changePassword,forgetPassword,forgetPasswordEmail}
