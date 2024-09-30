const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    activities:[{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'
        , required: true}],//this is data contained, how to access the data ??
    locations:[{type:String, required: true}],
    //timeline
    //duration for each activity
    language: {type: String, required: true},
    price:{type: Number, required: true},
    availableDates:[{type: Date, required: true}],
    availableTime: [{type: String, required: true}],
    accessability: {type: String, required: true},
    pickupLocation: {type: String, required: true},
    dropoffLocation: {type: String, required: true},
    //make a fcuntion that allow deletion or not maybe a booking schema 
}, {timestamps: true});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;