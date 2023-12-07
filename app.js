const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Book = require("./models/book.model");

// app service
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to our Book Store");
});

//Books APIs

//list all the books
app.get("/Books", async (req, res) => {
  try {
    const users = await Book.find({}, { __v: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get book by bookName (search)
app.get("/book/:bookName", async (req, res) => {
  try {
    // req id
    const bookName = req.params.bookName;
    // find by id in users
    const book = await Book.findById(bookName);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete book (foradmin)
app.delete("/book/:bookName", async (req, res) => {
  // req id
  const bookName = req.params.bookName;
  // delet by id in users

  try {
    const { bookName } = req.params;
    const book = await Book.findByIdAndDelete(bookName);
    if (!book) {
      return res
        .status(404)
        .json({ message: `cannot find any user with ID ${bookName}` });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add book (foradmin)
app.post("/addbook", async (req, res) => {
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
    res.status(500).send("Server error: " + err);
  }
});

//edit book info,pdfname (for admin )
app.patch("/editbook", async (req, res) => {
  try {
    //get user object from body
    const bookName = req.query.bookName;
    let info = req.body.info;
    let pdfName = req.body.pdfName;
    const book = await Book.findOne({ bookName: bookName });

    // // validate
    if (!book) {
      return res.status(404).json({ message: "book not found" });
    }
    if (info) {
      book.info = info;
    }
    if (pdfName) {
      book.pdfName = pdfName;
    }
    await book.save();
    res.send("book successfully updated");
  } catch (err) {
    res.status(500).send("server error: " + err);
  }
});

//user log in
app.post("/login", async (req, res) => {
  const { fullName, password } = req.body;
  if (fullName && password) {
    try {
      // Find the user in the in-memory database
      const user = await User.findOne({ fullName });

      // Check if the user exists and the password matches (replace with proper password hashing)
      if (user && user.password === password) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "You have to type a username and password" });
  }
});

//user Sign up
app.post("/signup", async (req, res) => {
  const { fullName, password, email } = req.body;

  // Check if username or email is already registered
  if (users.some((user) => user.fullName === fullName)) {
    return res.status(400).json({ error: "Username already exists" });
  } else if (users.some((user) => user.email === email)) {
    return res.status(400).json({ error: "email already exists" });
  } else {
    // Save the user to the in-memory database (replace with database storage)
    const newUser = {
      fullName,
      password,
      email, // In a real-world scenario, you would hash the password before saving it
    };

    const user = new User(newUser);
    await user.save();
    res.send("User added Succefully");
  }
});

//starting the app
mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/BookStore")
  .then(() => {
    console.log("connected to MongoDB");
    //listen on specific port
    app.listen(8000, () => console.log("app started on port 8000"));
  })
  .catch((error) => {
    console.log("cant connect to mongodb" + error);
  });
