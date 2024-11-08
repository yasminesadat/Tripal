const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  hotelid: {
    type: String,
    required: true
  },
  hotelname:{
    type:String,
    required:true
  },
  singleRoom: {
    type: Number,
    required: true
  },
  doubleRoom: {
    type: Number,
    required: true
  },
  tripleRoom: {
    type: Number,
    required: true
  },
  
  
    checkIn: {
      type: Date,
      required: true
    },
    checkOut: {
      type: Date,
      required: true
    }
  ,
  pricing:{ 
      type: Number,
      required: true
  },
  status: {
    type: String,
    enum: [ 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
 
 
});

const hotelBookings = mongoose.model('HotelBooking', bookingSchema);

module.exports = hotelBookings;
