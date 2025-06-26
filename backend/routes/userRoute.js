import express from 'express';
// import {paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe} from '../controllers/paymentController.js';
import { 
    loginUser, 
    registerUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    cancelAppointment,
    getPrescription,
    forgotPasswordUser,
    resetPasswordUser ,
    paymentStatus // Import from userController instead
} from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/prescriptions", authUser, getPrescription); // This should use the function from userController
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
// userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
//userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
// userRouter.post("/payment-stripe", authUser, paymentStripe)
// userRouter.post("/verifyStripe", authUser, verifyStripe)
userRouter.post("/forgot-password", forgotPasswordUser);
userRouter.post("/reset-password", resetPasswordUser);
userRouter.post("/update-payment-status", paymentStatus);
export default userRouter;