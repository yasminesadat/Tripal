const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sellerSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // name: {
    //   type: String,
    //   required: false,
    //   default: "",
    // },

    description: {
      type: String,
      required: false,
      default: "",
    },

    logo: {
      type: String,
      required: false,
      default: "",
    },
    notificationList:[ {
      message: String,
      read: {type:Boolean , default: false} ,
      createdAt:{type:Date , default: Date.now} 
    }]
  },
  { timestamps: true }
);
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
