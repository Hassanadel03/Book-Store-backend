const express = require("express");
const Cartrouter = express.Router();
const User = require("../models/user.model");
const Product = require("../models/Product.model");

// Add a product to the user's cart
Cartrouter.post("/AddToCart", async (req, res) => {
  try {
    const username = req.body.username;
    const productId = req.body.productId;
    const quantity = req.body.quantity || 1;

    const user = await User.findOne({ username });
    const product = await Product.findOne({ productId });

    if (!user || !product) {
      return res.status(404).json({ error: "User or product not found" });
    }

    // Check if the product is already in the cart, update quantity if it is
    const existingProductIndex = user.cart.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (existingProductIndex !== -1) {
      user.cart[existingProductIndex].quantity += quantity;
    } else {
      // Add the product to the cart
      user.cart.push({ productId, quantity });
    }

    // Save the updated user with the new cart
    await user.save();

    res.json({ message: "Product added to the cart successfully" });
  } catch (error) {
    console.error("Error adding product to the cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get the user's cart
Cartrouter.get("/GetCart", async (req, res) => {
  try {
    const username = req.body.username;
    const user = await User.findOne({ username }).populate("cart.productname");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Error getting user cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = Cartrouter;
