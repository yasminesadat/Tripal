const mongoose = require('mongoose');
const itinerarySchema = new mongoose.Schema({

    title:{type: String, required: true},

    description: {type: String, required: true},

    tourGuide: {type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true},

    activities:[{type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true}],
    location: {
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
    },
    timeline: [
        {
            activityName: { type: String}, 
            content: { type: String},
            time: { type: String},
            date: { type: Date},
        },
    ],

    serviceFee: {type: Number}, 
    language: {type: String, required: true},
    price:{type: Number},

    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},

    accessibility: [{type: String, required: true}],
    pickupLocation: {type: String, required: true},
    dropoffLocation: {type: String, required: true},
    averageRating: {type: Number,default: 0.0,},    
    tags:[{type:String}],
    bookings: [
        {
            touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' },
            tickets: { type: Number, default: 1 },
        },
    ],
    flagged: {type: Boolean, default: false},
    isActive: {type: Boolean, default: true},
    }, 
    {timestamps: true}
);

//this hook middleware is used to prevent the deletion of an itinerary that has bookings
itinerarySchema.pre('findOneAndDelete', async function (next) {
    const itinerary = await this.model.findOne(this.getQuery());
    if (itinerary.bookings.length > 0) {
        next(new Error('Cannot delete itinerary with associated tourists.'));
    } else {
        next();
    }
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
module.exports = Itinerary;