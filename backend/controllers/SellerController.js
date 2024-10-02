const sellerModel = require('../models/Seller.js');
const bcrypt = require('bcrypt');
const userModel = require('../models/User.js')
const createSeller = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const seller = await sellerModel.create({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword
        });
        const id = seller._id
        await userModel.create({
            userID: id,
            role: "Seller"
        })
        res.status(200).json(seller);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const updateSellerData = async (req, res) => {
    try {
        const { id } = req.params;



        const updatedSeller = await sellerModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true });

        if (!updatedSeller) {
            return res.status(404).json('Seller  not found');
        }

        return res.status(200).json({ updatedSeller })
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = { createSeller, updateSellerData };