const asyncHandler = require("express-async-handler");
const Tourist = require("../models/users/Tourist");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createOrder = asyncHandler(async (req, res) => {
  const touristId = req.userId;
  const {deliveryAddress, paymentMethod } = req.body;
  
    try {
        const tourist = await Tourist.findById({_id: touristId}).populate("cart.product");
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
        touristId: touristId,
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

const cancelOrder = asyncHandler(async (req,res) =>{
    const { id } = req.params;;
    try {
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ message: "Order not found." });
        }
        if (order.status === "Cancelled"){
          return res.status(400).json({ message: "Order is already cancelled." });
        }
        if(order.status === "Shipped"){
          return res.status(400).json({ message: "Can't cancel order. Order is already shipped." });
        }
        if(order.status === "Delivered"){
          return res.status(400).json({ message: "Can't cancel order. Order is already delivered." });
        }
    
        order.status = "Cancelled";
        await order.save();
    
        res.status(200).json({ message: "Order cancelled successfully.", order });
      } catch (error) {
        res.status(500).json({ message: "An error occurred while cancelling the order.", error: error.message });
      }
})

const getOrders = asyncHandler(async (req, res) => {
  const touristId = req.userId; 
  try {
    const orders = await Order.find({ touristId });

    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user." });
      }
    res.status(200).json({ orders });
    } 
    catch (error) {
      res.status(500).json({ message: "Failed to fetch orders. Please try again later." });
    }
});

module.exports = {
    createOrder,
    cancelOrder,
    getOrders
};