import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/appointmentModel.js";
import prescriptionModel from "../models/prescriptionModel.js";
import Rating from "../models/ratingModel.js";
// API for doctor Login 
// const loginDoctor = async (req, res) => {

//     try {

//         const { email, password } = req.body
//         const user = await doctorModel.findOne({ email })

//         if (!user) {
//             return res.json({ success: false, message: "Invalid credentials" })
//         }

//         const isMatch = await bcrypt.compare(password, user.password)

//         if (isMatch) {
//             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
//             res.json({ success: true, token })
//         } else {
//             res.json({ success: false, message: "Invalid credentials" })
//         }


//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
// API for doctor Login 
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await doctorModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Check if doctor account is active
        if (user.isActive === false) {
            return res.json({ 
                success: false, 
                message: "Your account has been deactivated. Please contact admin." 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// Generate and send password reset token
// Generate and send password reset token
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Find doctor by email
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'If this email exists, a reset link has been sent' });
        }

        // Generate reset token (expires in 1 hour)
        const resetToken = jwt.sign(
            { id: doctor._id }, 
            process.env.JWT_SECRET + doctor.password, 
            { expiresIn: '1h' }
        );

        // Save token to database
        await doctorModel.findByIdAndUpdate(doctor._id, { 
            resetPasswordToken: resetToken,
            resetPasswordExpires: Date.now() + 3600000 // 1 hour from now
        });

        // In a real app, you would send an email here with the reset link
        // For development, we'll log it to console
        const resetUrl = `${req.headers.origin}/reset-password?token=${resetToken}`;
        console.log(`Password reset link: ${resetUrl}`);
        
        res.json({ 
            success: true, 
            message: 'If this email exists, a password reset link has been sent',
            token:resetUrl
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reset password with token
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token and new password are required' 
            });
        }

        // Find doctor by token
        const doctor = await doctorModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!doctor) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET + doctor.password);
        
        // Check password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        await doctorModel.findByIdAndUpdate(doctor._id, {
            password: hashedPassword,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined
        });

        res.json({ 
            success: true, 
            message: 'Password reset successfully' 
        });

    } catch (error) {
        console.error(error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Token has expired' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
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
        const { userId, doctorId, rating, review } = req.body;

        if (!userId || !doctorId || !rating) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Validating rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        // Create a new rating
        const newRating = new Rating({
            userId,
            doctorId,
            rating,
            review
        });

        await newRating.save();

        // Optionally, update the doctor's average rating here:
        const ratings = await Rating.find({ doctorId });
        const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

        // Update the doctor's overall rating
        await doctorModel.findByIdAndUpdate(doctorId, { rating: avgRating });

        res.json({ success: true, message: 'Rating added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDoctorRatings = async (req, res) => {
    try {
        const { docId } = req.params; // <-- get doctor id from URL params

        if (!docId) {
            return res.status(400).json({ success: false, message: 'Doctor ID is required' });
        }

        const ratings = await Rating.find({ doctorId: docId }).populate('userId', 'name email');

        // Calculate average rating
        const avgRating = ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
            : 0;

        res.json({ success: true, ratings, avgRating });

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
// const updateDoctorProfile = async (req, res) => {
//     try {

//         const { docId, fees, address, available } = req.body

//         await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

//         res.json({ success: true, message: 'Profile Updated' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available,location,about, preferredDays, preferredHours } = req.body;
        const imageFile = req.file

        await doctorModel.findByIdAndUpdate(docId, { 
            fees, 
            address, 
            available,
            location,
            about,
            preferredDays,
            preferredHours
        });

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(docId, { image: imageURL })
        }
        res.json({ success: true, message: 'Profile Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
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

//import appointmentModel from '../models/appointmentModel.js';

// ✅ Download appointment report for a given date and time
const downloadReport = async (req, res) => {
    try {
      const { date, timeRange } = req.query;  // Changed from startDate/endDate to just date
      const doctorId = req.doctorId;
  
      if (!date) {
        return res.status(400).json({ 
          success: false,
          message: "Date is required." 
        });
      }
  
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD." 
        });
      }
  
      // Convert date from "YYYY-MM-DD" to "d_m_yyyy" format used in your database
      const formatDateForDB = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day)}_${parseInt(month)}_${year}`;
      };
  
      const formattedDate = formatDateForDB(date);
      
      // Create Date object for comparison
      const dateObj = new Date(date);
  
      console.log(`Searching appointments for ${formattedDate}`);
  
      // Build initial query
      const query = { 
        docId: doctorId,
        slotDate: formattedDate  // Exact match for the single date
      };
  
      // Get all appointments for the doctor for that date
      let appointments = await appointmentModel.find(query)
        .populate('userId', 'name email phone age address')
        .sort({ slotTime: 1 });
  
      console.log(`Found ${appointments.length} appointments for ${formattedDate}`);
  
      // Add time range filter if provided
      if (timeRange && timeRange.trim() !== '') {
        console.log(`Applying time range filter: ${timeRange}`);
        
        // Handle different time range formats
        let startTime, endTime;
        
        if (timeRange.includes('-')) {
          [startTime, endTime] = timeRange.split('-').map(t => t.trim());
        } else {
          console.log('Time range format not recognized, skipping time filter');
        }
  
        if (startTime && endTime) {
          // Convert time to 24-hour format for comparison if needed
          const convertTo24Hour = (timeStr) => {
            if (timeStr.includes('AM') || timeStr.includes('PM')) {
              const [time, period] = timeStr.split(/\s?(AM|PM)/i);
              let [hours, minutes] = time.split(':').map(Number);
              
              if (period.toUpperCase() === 'PM' && hours !== 12) {
                hours += 12;
              } else if (period.toUpperCase() === 'AM' && hours === 12) {
                hours = 0;
              }
              
              return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            return timeStr;
          };
  
          const normalizedStartTime = convertTo24Hour(startTime);
          const normalizedEndTime = convertTo24Hour(endTime);
  
          appointments = appointments.filter(appointment => {
            const appointmentTime = convertTo24Hour(appointment.slotTime);
            return appointmentTime >= normalizedStartTime && appointmentTime <= normalizedEndTime;
          });
  
          console.log(`After time filtering (${normalizedStartTime} - ${normalizedEndTime}): ${appointments.length} appointments`);
        }
      }
  
      // Rest of the function remains the same...
      // Just update the response to show single date instead of range
      res.status(200).json({
        success: true,
        count: appointments.length,
        date: formattedDate,
        timeRange: timeRange || 'All Day',
        stats,
        data: enhancedAppointments
      });
  
    } catch (error) {
      console.error("Download report error:", error);
      res.status(500).json({ 
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
    getDoctorRatings,
    forgotPassword,
    resetPassword,
    downloadReport
}