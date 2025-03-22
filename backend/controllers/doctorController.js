import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const addDoctorRating = async (req, res) => {
    try {
        const { docId, rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Add rating and update the average
        doctor.ratings.push(rating);
        doctor.calculateAverageRating();
        await doctor.save();

        res.json({ success: true, message: "Rating added successfully", averageRating: doctor.averageRating });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
const getDoctorRatings = async (req, res) => {
    try {
        const { docId } = req.params;
        const doctor = await doctorModel.findById(docId).select("ratings");

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, ratings: doctor.ratings });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// const addPrescription = async (req, res) => {
//     try {
//         const { docId, appointmentId, medicines, notes } = req.body;

//         const appointmentData = await appointmentModel.findById(appointmentId);
//         if (!appointmentData) {
//             return res.json({ success: false, message: "Appointment not found" });
//         }

//         if (appointmentData.docId.toString() !== docId) {
//             return res.json({ success: false, message: "Unauthorized action" });
//         }

//         const prescription = new prescriptionModel({
//             appointmentId,
//             docId,
//             userId: appointmentData.userId,
//             medicines,
//             notes
//         });

//         await prescription.save();

//         res.json({ success: true, message: "Prescription added successfully", prescription });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };
const addPrescription = async (req, res) => {
    try {
        const { docId, appointmentId, medicines, notes } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.docId.toString() !== docId) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        // Ensure that a doctor cannot overwrite an existing prescription for the same appointment
        const existingPrescription = await prescriptionModel.findOne({ appointmentId, docId });
        if (existingPrescription) {
            return res.status(400).json({ success: false, message: "Prescription already exists for this appointment" });
        }

        const prescription = new prescriptionModel({
            appointmentId,
            docId,
            userId: appointmentData.userId,
            medicines,
            notes
        });

        await prescription.save();
        res.json({ success: true, message: "Prescription added successfully", prescription });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// API to get prescription for a patient
// const getPrescription = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const prescriptions = await prescriptionModel.find({ userId }).populate("docId", "name speciality");

//         res.json({ success: true, prescriptions });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };
const getPrescription = async (req, res) => {
    try {
        const { userId } = req.user; // Extract patient ID from token

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const prescriptions = await prescriptionModel
            .find({ userId })
            .populate("docId", "name speciality") // Fetch doctor details
            .sort({ createdAt: -1 }); // Latest prescriptions first

        res.json({ success: true, prescriptions });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// API to get prescription for a doctor based on appointments
const getDoctorPrescriptions = async (req, res) => {
    try {
        const { docId } = req.body;
        const prescriptions = await prescriptionModel.find({ docId }).populate("userId", "name email");

        res.json({ success: true, prescriptions });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};



export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    addPrescription, getPrescription, getDoctorPrescriptions,
    addDoctorRating,
    getDoctorRatings
}