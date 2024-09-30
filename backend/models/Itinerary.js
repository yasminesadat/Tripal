const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    activities:[{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'
        , required: true}],//this is data contained, how to access the data ??
    locations:[{type:String, required: true}],
    //timeline btetrateb??
    //timeline: {type: String,required: true,},
    //duration for each activity activity 3ando time already
    language: {type: String, required: true},
    price:{type: Number, required: true}, //activity 3ando price range
    availableDates:[{type: Date, required: true}],
    availableTime: [{type: String, required: true}],
    accessibility: {type: String, required: true},
    pickupLocation: {type: String, required: true},
    dropoffLocation: {type: String, required: true},
    //make a fcuntion that allow deletion or not maybe a booking schema 
}, {timestamps: true});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;