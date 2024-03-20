import express from 'express'
const router = express.Router();
import {userRegistration,userLogin,changePassword,forgetPassword,forgetPasswordEmail} from '../controllers/authController.js'
import checkIsUserAuthenticated from '../middlewares/authMiddleware.js';

router.post("/user/register" ,userRegistration)
router.post("/user/login",userLogin)

//Forget Password
router.post('/forget-password' ,forgetPassword)
router.post('/forget-password/:id/:token',forgetPasswordEmail)


//protected Routes
router.post('/change-password',checkIsUserAuthenticated,changePassword)


export default router;
