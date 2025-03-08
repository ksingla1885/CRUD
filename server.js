const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Shoe = require("./models/shoe");
const methodOverride = require("method-override");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/footflex", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Home Route: Display Shoes
app.get("/", async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.render("index.ejs", { shoes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// New Shoe Form Route
app.get("/shoes/new", (req, res) => res.render("new.ejs"));

// Add New Shoe
app.post("/shoes", upload.single("image"), async (req, res) => {
    try {
        const { name, brand, price, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : "";
        const newShoe = new Shoe({ name, brand, price, description, image });
        await newShoe.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding shoe");
    }
});

// Edit Page Route
app.get("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const shoe = await Shoe.findById(id);
        if (!shoe) return res.status(404).send("Shoe not found");
        res.render("edit.ejs", { shoe });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Update Shoe Details
app.post("/edit/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const shoe = await Shoe.findById(id);
        if (!shoe) return res.status(404).send("Shoe not found");

        shoe.name = req.body.name;
        shoe.brand = req.body.brand;
        shoe.price = req.body.price;
        shoe.description = req.body.description;

        if (req.file) shoe.image = `/uploads/${req.file.filename}`;

        await shoe.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating shoe");
    }
});

// Delete Shoe
app.delete("/shoes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Shoe.findByIdAndDelete(id);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting shoe");
    }
});

// Start Server
app.listen(3500, () => console.log("Server running on http://localhost:3500"));
