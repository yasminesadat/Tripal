const asyncHandler = require("express-async-handler");
const Tourist = require("../models/users/Tourist");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createOrder = asyncHandler(async (req, res) => {
    const { touristId, deliveryAddress, paymentMethod } = req.body;
  
    try {
        const tourist = await Tourist.findById(touristId).populate("cart.product");
        if (!tourist) {
        return res.status(404).json({ message: "Tourist not found." });
        }

        if (tourist.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Please add products to your cart." });
          }
        
        let totalPrice = 0;
        for (let cartItem of tourist.cart) {
           totalPrice += cartItem.price; 
        }

        const newOrder = new Order({
        tourist: touristId,
        products: tourist.cart,
        totalPrice: totalPrice,
        deliveryAddress: {
            street: deliveryAddress.street,
            city: deliveryAddress.city,
            zipCode: deliveryAddress.zipCode,
            country: deliveryAddress.country,
        },
        paymentMethod: paymentMethod,
        status: "Pending", 
        });

        await newOrder.save();

        tourist.cart = [];
        await tourist.save();

        res.status(201).json({
        message: "Order created successfully.",
        order: newOrder,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while creating the order.", error: error.message });
    }
});

module.exports = {
    createOrder,
}