const productModel = require('../models/product-model');

module.exports.handleCategory = async(req , res) => {
    try{
        const category = req.params.category;
        const products = await productModel.find({ category: { $regex: new RegExp(category, "i") } });

        res.render('shop', { products });
    }
    catch(error){
        console.log(error);
        res.status(500).send('Server error');
    }
}