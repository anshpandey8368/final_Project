const express = require('express');
const router = express.Router();
const userModel = require("../models/user-model")
const { registerUser, checkWho, returnToHome , addToCart , showCart , donate , deleteFromCart } = require('../controller/authController');
const isLoggedIn = require('../middleware/isLoggedIn');
const loadingMiddleware = require('../middleware/loadingMiddleware');

router.get('/', function(req, res) {
    res.render('login', { messages: req.flash('message') });
});


router.post('/register', registerUser);
router.post('/shop', checkWho);
router.get('/home', returnToHome);
router.get('/cart', isLoggedIn , showCart);
router.post('/donate', isLoggedIn , donate);
router.get('/addToCart/:id', isLoggedIn , addToCart);
router.get('/deleteFromCart/:id', isLoggedIn, deleteFromCart);

module.exports = router;
