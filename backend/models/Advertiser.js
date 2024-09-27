const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const advertiserSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4,
        unique : true
    },
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
        required: true,
    },
    accepted:{
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Advertiser = mongoose.model('Advertiser', advertiserSchema);
module.exports = Advertiser;