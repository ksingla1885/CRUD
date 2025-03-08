const express = require("express");
const router = express.Router();
const Shoe = require("../models/shoe");

// CREATE - New shoe form
router.get("/new", (req, res) => {
    res.render("new");
});

// CREATE - Add new shoe to DB
router.post("/", async (req, res) => {
    try {
        await Shoe.create(req.body);
        res.redirect("/shoes");
    } catch (err) {
        console.log(err);
        res.redirect("/shoes");
    }
});

// READ - Show all shoes
router.get("/", async (req, res) => {
    const shoes = await Shoe.find();
    res.render("index", { shoes });
});

// READ - Show a specific shoe
router.get("/:id", async (req, res) => {
    const shoe = await Shoe.findById(req.params.id);
    res.render("show", { shoe });
});

// UPDATE - Edit shoe form
router.get("/:id/edit", async (req, res) => {
    const shoe = await Shoe.findById(req.params.id);
    res.render("edit", { shoe });
});

// UPDATE - Update shoe in DB
router.put("/:id", async (req, res) => {
    await Shoe.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/shoes/" + req.params.id);
});

// DELETE - Remove shoe from DB
router.delete("/:id", async (req, res) => {
    await Shoe.findByIdAndDelete(req.params.id);
    res.redirect("/shoes");
});

module.exports = router;
