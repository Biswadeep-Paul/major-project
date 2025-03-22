import express from 'express';
import { 
  loginDoctor, 
  appointmentsDoctor, 
  appointmentCancel, 
  doctorList, 
  changeAvailablity, 
  appointmentComplete, 
  doctorDashboard, 
  doctorProfile, 
  updateDoctorProfile,
  addPrescription,
  getDoctorPrescriptions,
  getPrescription,
 getDoctorRatings,
 addDoctorRating
  
} from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
import authUser from '../middleware/authUser.js';
const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)
doctorRouter.post("/add-prescription", authDoctor, addPrescription);
doctorRouter.get("/prescriptions", authDoctor, getDoctorPrescriptions);
doctorRouter.get("/prescriptions1", authDoctor, getPrescription);
// New Routes for Ratings
//doctorRouter.post("/rate", authUser, addDoctorRating); // Users can rate doctors
doctorRouter.get("/:docId/ratings", getDoctorRatings);
doctorRouter.post("/rate", authUser, addDoctorRating);
export default doctorRouter;