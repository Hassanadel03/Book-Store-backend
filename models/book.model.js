const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema(
    {
        bookName: { type: String, unique: true, required: true },
        author: { type: String, unique: false, required: true },
        pdfName: { type: String, unique: true, required: true },
        info: { type: String, required: true },
    },
    {
        timestamps: true
    }

);
module.exports = mongoose.model('Book', bookSchema);