const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hisTagTypeSchema = new Schema(
  {
    name: {
      type: String,
      enum: ['Monuments','Museums', 'Religious Sites','Palaces/Castles','Archaeological Sites','Historical Routes','World Heritage Sites','Natural Heritage Sites'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HistoricalTagType", hisTagTypeSchema);
