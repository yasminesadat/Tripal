const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accepted:{
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
module.exports = TourGuide;