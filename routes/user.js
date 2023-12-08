const express = require("express");
const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const userRouter = express.Router();

// User Log In
userRouter.post("/login", async (req, res) => {
    const { userName, password } = req.body;
    if (userName && password) {
        try {
            const user = await User.findOne({ userName });
            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    res.json({ message: "Login successful" });
                } else {
                    res.status(401).json({ error: "Invalid password" });
                }
            } else {
                res.status(401).json({ error: "Invalid username" });
            }
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        res.status(400).json({ error: "You have to type a username and password" });
    }
});

// User Sign Up
userRouter.post("/signup", async (req, res) => {
    const { userName, password, email } = req.body;

    try {
        const existingUserByName = await User.findOne({ userName });
        const existingUserByEmail = await User.findOne({ email });
        // Basic email format validation using regex
        const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormatRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (existingUserByName) {
            return res.status(400).json({ error: "Username already exists" });
        } else if (existingUserByEmail) {
            return res.status(400).json({ error: "Email already exists" });
        } else {
            // Check password length
            if (password.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters long" });
            }
            const newUser = {
                userName,
                password,
                email,
            };

            const user = new User(newUser);
            await user.save();
            res.send("User added successfully");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Edit an existing user password or email
userRouter.put("/editUser", async (req, res) => {
    const username = req.body.username;
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ userName: username });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (email) {
            user.email = email;
        }
        if (password) {
            user.password = password;
        }

        await user.save();

        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error during user update:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = userRouter;
