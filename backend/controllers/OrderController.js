const asyncHandler = require("express-async-handler");
const Tourist = require("../models/users/Tourist");
const Product = require("../models/Product");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const updateProductQuantity = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ message: `Not enough stock for ${product.name}.` });
    }

    product.quantity -= quantity;

    await product.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductSales = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.sales += quantity;

    await product.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const createOrder = asyncHandler(async (req, res) => {
  const touristId = req.userId;
  const { deliveryAddress, paymentMethod } = req.body;

  try {
    const tourist = await Tourist.findById({ _id: touristId }).populate(
      "cart.product"
    );
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    if (tourist.cart.length === 0) {
      return res
        .status(400)
        .json({ message: "Cart is empty. Please add products to your cart." });
    }

    let totalPrice = 0;
    for (let cartItem of tourist.cart) {
      totalPrice += cartItem.price;
    }

    if (paymentMethod === "Wallet") {
      tourist.wallet.amount = tourist.wallet.amount || 0;

      if (tourist.wallet.amount < totalPrice) {
        return res.status(400).json({ error: "Insufficient wallet balance." });
      }

      for (let cartItem of tourist.cart) {
        try {
          await updateProductQuantity(cartItem.product._id, cartItem.quantity);
          await updateProductSales(cartItem.product._id, cartItem.quantity);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
      }

      tourist.wallet.amount -= totalPrice;

      let pointsToReceive = 0;
      if (tourist.totalPoints <= 100000) {
        pointsToReceive = totalPrice * 0.5;
      } else if (tourist.totalPoints <= 500000) {
        pointsToReceive = totalPrice * 1;
      } else {
        pointsToReceive = totalPrice * 1.5;
      }

      tourist.totalPoints = tourist.totalPoints || 0;
      tourist.currentPoints = tourist.currentPoints || 0;
      tourist.totalPoints += pointsToReceive;
      tourist.currentPoints += pointsToReceive;

      await tourist.save();

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

      return res.status(201).json({
        message: "Order created successfully.",
        order: newOrder,
      });
    } else if (paymentMethod === "Cash on Delivery") {
      for (let cartItem of tourist.cart) {
        try {
          await updateProductQuantity(cartItem.product._id, cartItem.quantity);
          await updateProductSales(cartItem.product._id, cartItem.quantity);
        } catch (error) {
          return res.status(400).json({ message: error.message });
        }
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

      return res.status(201).json({
        message:
          "Order created successfully. Payment will be collected upon delivery.",
        order: newOrder,
      });
    } else if (paymentMethod === "Credit Card") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: tourist.email,
        line_items: tourist.cart.map((product) => ({
          price_data: {
            currency: "egp",
            product_data: {
              name: product.product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        })),
        mode: "payment",
        success_url: `${
          process.env.FRONTEND_URL
        }/products-payment-success?session_id={CHECKOUT_SESSION_ID}&touristId=${touristId}&totalPrice=${totalPrice}&deliveryAddress=${encodeURIComponent(
          JSON.stringify(deliveryAddress)
        )}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      });
      console.log(session.id);
      // for (let cartItem of tourist.cart) {
      //   try {
      //     await updateProductQuantity(cartItem.product._id, cartItem.quantity);
      //     await updateProductSales(cartItem.product._id, cartItem.quantity);
      //   } catch (error) {
      //     return res.status(400).json({ message: error.message });
      //   }
      // }
      return res.status(200).json({
        message: "Redirecting to payment.",
        sessionId: session.id,
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while creating the order.",
        error: error.message,
      });
  }
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled." });
    }
    if (order.status === "Shipped") {
      return res
        .status(400)
        .json({ message: "Can't cancel order. Order is already shipped." });
    }
    if (order.status === "Delivered") {
      return res
        .status(400)
        .json({ message: "Can't cancel order. Order is already delivered." });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully.", order });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while cancelling the order.",
        error: error.message,
      });
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const touristId = req.userId;
  try {
    const orders = await Order.find({ touristId });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }
    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders. Please try again later." });
  }
});

const completeOrder = asyncHandler(async (req, res) => {
  const { sessionId, touristId, totalPrice, deliveryAddress, paymentMethod } =
    req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not successful." });
    }

    const tourist = await Tourist.findById(touristId).populate("cart.product");
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    let pointsToReceive = 0;
    if (tourist.totalPoints <= 100000) {
      pointsToReceive = totalPrice * 0.5;
    } else if (tourist.totalPoints <= 500000) {
      pointsToReceive = totalPrice * 1;
    } else {
      pointsToReceive = totalPrice * 1.5;
    }

    tourist.totalPoints = tourist.totalPoints || 0;
    tourist.currentPoints = tourist.currentPoints || 0;
    tourist.totalPoints += pointsToReceive;
    tourist.currentPoints += pointsToReceive;

    await tourist.save();

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

    return res.status(201).json({
      message:
        "Order created successfully. Payment will be collected upon delivery.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {
  createOrder,
  cancelOrder,
  getOrders,
  completeOrder,
};
