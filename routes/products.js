const express = require('express');
const router = express.Router();

const { handleCategory } = require('../controller/productController');
const loadingMiddleware = require('../middleware/loadingMiddleware');
const ownerPost = require('../controller/ownerController');
const upload = require("../config/mullter-config");

router.get('/', function(req, res) {
    res.send("Jai shree ram 2 bar bolo");
});

router.get('/:category',  loadingMiddleware , handleCategory);
router.post('/create', upload.single('image'), ownerPost)

module.exports = router;