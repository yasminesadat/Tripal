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


const readSellerData= async (req,res) =>{
try {
    const seller = await Seller.findOne({ userName: req.params.userName });
    
    if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
    }
    
    res.status(200).json({ status: 'success', data: seller });
} catch (error) {
    res.status(400).json({ error: error.message });
}


}

const updateSellerData = async (req, res) => {  // SAME CODE AS CREATE PROFILE???
    const { name, description } = req.body;
    try {
        const updatedSeller = await Seller.findOneAndUpdate(
            { userName: req.params.userName },
            { name, description },
            { new: true, runValidators: true } 
        );

        if (!updatedSeller) {
            return res.status(404).json({ error: 'Seller not found' });
        }

        res.status(200).json({ status: 'success', data: updatedSeller });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = { createSeller, readSellerData, updateSellerData };