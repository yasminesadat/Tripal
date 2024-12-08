const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    notificationList:[ {
      message: String,
      read: {type:Boolean , default: false} ,
      createdAt:{type:Date , default: Date.now} ,
      icon: {type:String, default:"icon-home"}
    }]


  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
