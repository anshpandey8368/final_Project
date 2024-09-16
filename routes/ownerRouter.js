const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const ownerModel = require("../models/owner");



if (process.env.NODE_ENV === "development") {
    router.post('/create', async (req, res) => {
        try {
            let owner = await ownerModel.find();
            if (owner.length > 0) {
                return res.status(503).send("You don't have permission to create owner");
            }

            let { name, password } = req.body;
            let hashPassword = await bcrypt.hash(password, 10);
            let createOwner = await new ownerModel({ name, email: "anshpandey8368@gmail.com" , password:hashPassword });
            await createOwner.save();
            res.status(201).send(createOwner); 
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    });
}

router.get('/admin', function(req, res) {
    let success = req.flash("success");
    res.render('adminPanel', { success });
})

module.exports = router;