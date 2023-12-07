const express = require("express");
const Book = require("../models/book.model");
const bcrypt = require('bcrypt');

const bookRouter = express.Router();

// List all the books
bookRouter.get("/Books", async (req, res) => {
    try {
        const books = await Book.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get book by bookName (search)
bookRouter.get("/book/:bookName", async (req, res) => {
    try {
        const bookName = req.params.bookName;
        const book = await Book.findById(bookName);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete book (for admin)
bookRouter.delete("/book/:bookName", async (req, res) => {
    const bookName = req.params.bookName;
    try {
        const book = await Book.findByIdAndDelete(bookName);
        if (!book) {
            return res.status(404).json({ message: `Cannot find any book with ID ${bookName}` });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add book (for admin)
bookRouter.post("/addbook", async (req, res) => {
    try {
        let bookParam = req.body;

        if (await Book.findOne({ bookName: bookParam.bookName })) {
            res.send('Book "' + bookParam.bookName + '" already exists');
        } else if (await Book.findOne({ pdfName: bookParam.pdfName })) {
            res.send('PDF name "' + bookParam.pdfName + '" already exists');
        } else {
            const book = new Book(bookParam);
            await book.save();
            res.send("Book added successfully");
        }
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
});

// Edit book info, pdfname (for admin)
bookRouter.patch("/editbook", async (req, res) => {
    try {
        const bookName = req.query.bookName;
        let info = req.body.info;
        let pdfName = req.body.pdfName;
        const book = await Book.findOne({ bookName: bookName });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (info) {
            book.info = info;
        }
        if (pdfName) {
            book.pdfName = pdfName;
        }
        await book.save();
        res.send("Book successfully updated");
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
});

module.exports = bookRouter;
