const express = require("express");
const Cartrouter = express.Router();
const User = require("../models/user.model");

// Add a book to the user's cart
Cartrouter.post('/add-to-cart/:bookName', async (req, res) => {
  const { bookName } = req.params;
  const fullName = req.body.fullName

  try {
    // Find the user by some identifier (e.g., user ID from authentication)
    const user = await User.findOne({ fullName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the bookname to the user's cart
    user.cart.push(bookName);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'book added to cart successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get the user's cart
Cartrouter.get('/get-cart', async (req, res) => {
  const fullName = req.body.fullName

  try {
    const user = await User.findOne({ fullName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the items in the user's cart
    const cartItems = user.cart;

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' + error });
  }
});

Cartrouter.delete('/remove-from-cart/:bookname', async (req, res) => {
  const { bookname } = req.params;
  const fullName = req.body.fullName;

  try {
    const user = await User.findOne({ fullName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the index of the book in the user's cart
    const bookIndex = user.cart.indexOf(bookname);

    // Check if the book is in the cart
    if (bookIndex !== -1) {
      // Remove the book from the user's cart
      user.cart.splice(bookIndex, 1);

      // Save the updated user
      await user.save();

      res.status(200).json({ message: 'Book removed from cart successfully', user });
    } else {
      res.status(404).json({ message: 'Book not found in the user\'s cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = Cartrouter;
