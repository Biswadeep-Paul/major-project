import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    location:{type:String},
    preferredDays: { 
        type: [String], 
        default: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        enum: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    },
    preferredHours: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '17:00' }
    },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
     ratings: { type: Number ,ref:'Rating'}, // Store multiple ratings
    // averageRating: { type: Number, default: 0 },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false })
// doctorSchema.methods.calculateAverageRating = function () {
//     if (this.ratings.length === 0) {
//         this.averageRating = 0;
//     } else {
//         this.averageRating = this.ratings.reduce((acc, rating) => acc + rating, 0) / this.ratings.length;
//     }
//     return this.averageRating;
// };

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;