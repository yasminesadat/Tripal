const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        discountPercentage: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
module.exports = PromoCode; 
