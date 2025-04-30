import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    doctorId: {
        type: String,
        ref: 'Doctor',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
