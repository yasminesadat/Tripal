const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tourist: [{type:mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true}], 
    itinerary: {type:mongoose.Schema.Types.ObjectId, ref: 'Itinerary', required: true}, 
    tourGuide: {type:mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true},
})

const Booking = mongoose.model("Booking",bookingSchema);
module.exports=Booking;