import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment", required: true },
    docId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    medicines: [{ name: String, dosage: String, duration: String }], // Example: [{ name: "Paracetamol", dosage: "500mg", duration: "5 days" }]
    notes: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

const prescriptionModel = mongoose.models.prescription || mongoose.model("prescription", prescriptionSchema);
export default prescriptionModel;
