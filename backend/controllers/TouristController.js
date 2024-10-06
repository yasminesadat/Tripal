const touristModel = require("../models/Tourist");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const walletModel = require("../models/Wallet");
var validator = require("email-validator");
var passwordValidator = require("password-validator");
const userModel = require('../models/User.js')
// var schema = new passwordValidator();
// schema
//   .is().min(8)
//   .is().max(100)
//   .has().uppercase()
//   .has().lowercase()
//   .has().digits(1)
//   .has().not().spaces()
//   .has()
//   .symbols()
//   .is()
//   .not()
//   .oneOf(["Passw0rd", "Password123"]);

// const createTourist = async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const {
//       userName,
//       email,
//       password,
//       confirmPassword,
//       mobileNumber,
//       nationality,
//       dateOfBirth,
//       job,
//     } = req.body;
//     if (!userName || !email || !password) {
//       res.status(400);
//       throw new Error("Please add all fields");
//     }

//     const userExists = await touristModel.findOne({ email });
//     if (userExists) {
//       res.status(400);
//       throw new Error("User already exists");
//     }
//     // validate email and password= confirm password
//     // if (!validator.validate(email)) {
//     //   res.status(400);
//     //   throw new Error("Wrong email format");
//     // }
//     // if (!schema.validate(password)) {
//     //   res.status(400);
//     //   throw new Error(
//     //     "Weak password , min 8 characters , 1 uppercase , 1 lowercase , 1 special symbol , and a number"
//     //   );
//     // }

//     if (!password == confirmPassword) {
//       res.status(400);
//       throw new Error("Passwords do not match");
//     }

//     // 8 character minimum , upper case lower case number special character
//     // console.log("email validity", validator.validate(email));
//     const tourist = await touristModel.create({
//       userName: req.body.userName,
//       email: req.body.email,
//       password: hashedPassword,
//       mobileNumber: req.body.mobileNumber,
//       nationality: req.body.nationality,
//       dateOfBirth: req.body.dateOfBirth,
//       job: req.body.job,
//     });

//     const id = tourist._id;
//     await userModel.create({
//       userID: id,
//       role: "Tourist"
//     })
//     const wallet = await walletModel.create({
//       userID: id,
//     });

//     res.status(200).json(tourist);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



const createTourist = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { userName, email, password, confirmPassword, mobileNumber, nationality, dateOfBirth, job } = req.body;

    // Validate required fields
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "Please add all fields" });
    }

    const existingName = await touristModel.findOne({ userName });
    if (existingName) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const userExists = await touristModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "email already exists" });
    }

    const tourist = await touristModel.create({
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
      mobileNumber: req.body.mobileNumber,
      nationality: req.body.nationality,
      dateOfBirth: req.body.dateOfBirth,
      job: req.body.job,
    });

    const id = tourist._id;
    await userModel.create({
      userID: id,
      role: "Tourist",
    });

    await walletModel.create({ userID: id });

    return res.status(201).json(tourist);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


const getTouristInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // checks if the id is a valid one
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }

    // retreives all the info beta3 el tourist by his id
    const touristInformation = await touristModel.findById(id).lean();
    if (!touristInformation) {
      return res.status(404).json("Tourist profile doesn't exist");
    }
    // find corresponding wallet for this user (by default created with a balance of 0)
    const touristWallet = await walletModel.findOne({ userID: id });
    let walletBalance = "No wallet information available";

    if (touristWallet) {
      walletBalance = `${touristWallet.amount} ${touristWallet.currency}`;
    }

    touristInformation.walletBalance = walletBalance;

    return res.status(200).json(touristInformation);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updateTouristProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...updateParameters } = req.body;

    if (updateParameters.userName) {
      res.status(400).json({
        status: "error",
        message: "You cannot update your username",
      });
    }
    if (updateParameters.walletBalance) {
      res.status(400).json({
        status: "error",
        message: "You cannot update your balance",
      });
    }
    if (updateParameters.dateOfBirth) {
      res.status(400).json({
        status: "error",
        message:
          "You cannot update your date of birth, dont you know when you were born??",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid tourist ID",
      });
    }
    const touristToBeUpdated = await touristModel.findByIdAndUpdate(
      id,
      updateParameters,
      { new: true }
    );
    console.log(touristToBeUpdated);
    if (!touristToBeUpdated) {
      return res.status(404).json("Tourist profile doesnt exist");
    }

    return res
      .status(200)
      .json({ status: "success", data: { touristToBeUpdated } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { createTourist, getTouristInfo, updateTouristProfile };
