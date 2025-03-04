import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js';
//import {paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe}
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();
import {getPrescription} from "../controllers/doctorController.js"
userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/prescriptions", authUser, getPrescription);
userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
// userRouter.post("/payment-razorpay", authUser, paymentRazorpay)

 //userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)

// userRouter.post("/payment-stripe", authUser, paymentStripe)
// userRouter.post("/verifyStripe", authUser, verifyStripe)

export default userRouter;