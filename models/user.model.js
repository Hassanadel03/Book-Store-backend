const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        cart: { type: [String], required: true },
        phoneNumber: { type: String, required: false },


    },
    {
        timestamps: true
    }

);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password
        this.password = hashedPassword; // Store the hashed password
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('User', userSchema);