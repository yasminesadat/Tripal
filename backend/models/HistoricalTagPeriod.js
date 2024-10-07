const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hisTagPeriodchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
  },
  { timestamps: true }
);
const HistoricalTagPeriod = mongoose.model("HistoricalTagPeriod", hisTagPeriodchema);
module.exports = HistoricalTagPeriod
