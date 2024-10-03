const advertiserModel = require('../models/Advertiser.js');
const bcrypt = require('bcrypt');
const userModel = require('../models/User.js')

const createAdvertiser = async (req, res) => {
    try {
        const { userName, email, password, website, hotline, companyProfile } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const advertiser = await advertiserModel.create({
            userName,
            email,
            password: hashedPassword,
            website, 
            hotline, 
            companyProfile 
        });
        const id = advertiser._id
        await userModel.create({
            userID: id,
            role: "Advertiser"
        })
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const readAdvertiser = async (req, res) => {
    try {
        const advertiser = await advertiserModel.findById(req.params.id);
        if (!advertiser) {
            return res.status(404).json({ error: "Advertiser not found" });
        }
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const updateAdvertiser = async (req, res) => {
    try {
        const { userName, email, password, website, hotline, companyProfile } = req.body;
        const existingAdvertiser = await advertiserModel.findById(req.params.id);
        if (!existingAdvertiser) {
            return res.status(404).json({ error: "Advertiser not found" });
        }
        let hashedPassword = existingAdvertiser.password; // Keep the current password if not updated
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(
            req.params.id,
            {
              userName,
              email,
              password: hashedPassword, 
              website,
              hotline,
              companyProfile
            },
            { new: true, runValidators: true }
          );
      
          if (!updatedAdvertiser) {
            return res.status(404).json({ error: "Advertiser not found" });
          }

        res.status(200).json(updatedAdvertiser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




module.exports = { createAdvertiser, readAdvertiser, updateAdvertiser };