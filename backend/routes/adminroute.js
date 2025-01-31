import express from "express";
import { addDoctor, allDoctors, loginAdmin } from "../controllers/adminController.js"; // ✅ Corrected import path
import upload from "../middleware/multer.js"; // ✅ Adjusted path
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";
const adminRouter = express.Router();

// Route to Add Doctor
adminRouter.post("/add-doctor", upload.single("image"), addDoctor);
adminRouter.post("/login",loginAdmin);
adminRouter.post('/all-doctors',authAdmin,allDoctors);
adminRouter.post('/change-availability',authAdmin,changeAvailablity);
export default adminRouter;