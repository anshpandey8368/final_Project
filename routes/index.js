const express = require('express');;
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');
const productModel = require('../models/product-model');


router.get('/', isLoggedIn , function(req, res) {
    let error = req.flash("error");
    res.render('login', { error });
});

router.get("/shop" , async function(req, res) {
    try {
        const products = await productModel.find(); 
        console.log(products);
        res.render('shop', { products }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
