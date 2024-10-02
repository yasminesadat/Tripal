const bcrypt = require("bcrypt");
const TourismGovernor = require("../models/TourismGovernor.js");
const userModel = require('../models/User.js')



const addTourismGovernor = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Check if username already exists
      const existingName = await TourismGovernor.findOne({ username });
      if (existingName) {
        return res.status(400).json({ error: "Username already exists" });
      }
  
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newTourismGovernor = await TourismGovernor.create({
        username: req.body.username,
        password: hashedPassword,
      });

      const id = newTourismGovernor._id
        await userModel.create({
            userID: id,
            role: "TourismGovernor"
        })
      res.status(200).json(newTourismGovernor);
  
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

const getTourismGovernors = async (req, res) => {
    try {
        const governor = await TourismGovernor.find();
        if (governor.length === 0) {
            return res.status(400).json('No governors found');
        }

        res.status(200).json(governor);
    }
    catch (error) {
        res.status(404).json('Error fetching all governors', error);
    }
}


module.exports = {addTourismGovernor, getTourismGovernors};
