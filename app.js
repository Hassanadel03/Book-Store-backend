const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const cartRoutes = require("./routes/cart");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome to our Book Store");
});

// Use the user routes
app.use("/", userRoutes);

// Use the book routes
app.use("/", bookRoutes);

//use cart routes
app.use("/", cartRoutes);

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/BookStore")
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(8000, () => console.log("app started on port 8000"));
  })
  .catch((error) => {
    console.log("can't connect to mongodb" + error);
  });
