import express from 'express';
import { 
  loginAdmin, 
  appointmentsAdmin, 
  appointmentCancel, 
  addDoctor, 
  allDoctors, 
  adminDashboard,
  toggleDoctorAccess  // Import the new controller
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const adminRouter = express.Router();

// Admin authentication
adminRouter.post("/login", loginAdmin);

// Doctor management routes
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/toggle-doctor-access", authAdmin, toggleDoctorAccess);  // New route

// Appointment management routes
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

// Doctor availability
adminRouter.post("/change-availability", authAdmin, changeAvailablity);

// Dashboard statistics
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;