const mongoose = require("mongoose");

const shoeSchema = new mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    description: String,
    image: String // Store file path
});

module.exports = mongoose.model("Shoe", shoeSchema);
