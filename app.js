const express = require("express")
const mongoose = require('mongoose')
const User = require('./models/user.model')
const Book = require('./models/book.model')




// app service 
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.send('Welcome to our Book Store');
});


//Books APIs

//list all the books
app.get('/Books', async (req, res) => {
    try {
        const users = await Book.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//get book by bookName (search)
app.get('/book/:bookName', async (req, res) => {

    try {
        // req id 
        const bookName = req.params.bookName;
        // find by id in users 
        const book = await Book.findById(bookName);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// delete book (foradmin)
app.delete('/book/:bookName', async (req, res) => {

    // req id 
    const bookName = req.params.bookName;
    // delet by id in users 

    try {
        const { bookName } = req.params;
        const book = await Book.findByIdAndDelete(bookName);
        if (!book) {
            return res.status(404).json({ message: `cannot find any user with ID ${bookName}` })
        }
        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// add book (foradmin)
app.post('/addbook', async (req, res) => {
    try {
        // Get book object from the request body
        let bookParam = req.body;

        // Validate if the book or pdfName already exists
        if (await Book.findOne({ bookName: bookParam.bookName })) {
            res.send('Book "' + bookParam.bookName + '" already exists');
        } else if (await Book.findOne({ pdfName: bookParam.pdfName })) {
            res.send('PDF name "' + bookParam.pdfName + '" already exists');
        } else {
            // If neither bookName nor pdfName exists, save the book
            const book = new Book(bookParam);
            await book.save();
            res.send("Book added successfully");
        }
    } catch (err) {
        res.status(500).send('Server error: ' + err);
    }
});


//edit book info,pdfname (for admin )
app.patch('/editbook', async (req, res) => {
    try {
        //get user object from body 
        const bookName = req.query.bookName;
        let info = req.body.info;
        let pdfName = req.body.pdfName;
        const book = await Book.findOne({ bookName: bookName });

        // // validate
        if (!book) {
            return res.status(404).json({ message: 'book not found' });
        }
        if (info) {
            book.info = info;
        }
        if (pdfName) {
            book.pdfName = pdfName;
        }
        await book.save();
        res.send("book successfully updated")

    } catch (err) {
        res.status(500).send('server error: ' + err);
    }
});




//user Sign in



//user Sign up




//starting the app
mongoose.set("strictQuery", false)
mongoose
    .connect('mongodb://127.0.0.1:27017/BookStore')
    .then(() => {
        console.log('connected to MongoDB')
        //listen on specific port 
        app.listen(8000, () => console.log('app started on port 8000'))
    }).catch((error) => {
        console.log('cant connect to mongodb' + error)
    })

