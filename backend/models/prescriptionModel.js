import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    medicines: [{ name: String, dosage: String, duration: String }], 
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

// Ensure a doctor can't add multiple prescriptions for the same appointment
prescriptionSchema.index({ appointmentId: 1, docId: 1, userId: 1 }, { unique: true });

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;