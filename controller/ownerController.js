const productModel = require('../models/product-model')

module.exports = async(req, res) => {
    try{
        let { name, price, category , description , discount, bgColor, panelColor, textColor } = req.body;

        if (!name || !price  || !category || !description || !discount || !bgColor || !panelColor || !textColor) {
            return res.status(400).send("All fields are required.");
        }

        let products = await productModel.create({ image:req.file.buffer , name, price, category, description , discount, bgColor, panelColor, textColor });

        req.flash("success", "product created sucessfully");
        res.redirect('/owner/admin');
    }
    catch(error){
        res.status(500).send(error);
    }
}

