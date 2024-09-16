const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = require('../utils/generateToken');
const userModel = require('../models/user-model');
const ownerModel = require('../models/owner');
const productModel = require('../models/product-model');

module.exports.registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await userModel.findOne({ email });

        if (existUser) {
            return res.status(400).send("This user already exists");
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hashPassword }); 
        await user.save();

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, secure: false });

        return res.status(201).render("shop");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await userModel.findOne({ email });

        if (!checkUser) {
            return res.status(404).send("User not found");
        }

        const checkPassword = await bcrypt.compare(password, checkUser.password);

        if (!checkPassword) {
            return res.status(400).send("Invalid credentials");
        }

        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', });

        res.render("shop");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

module.exports.checkWho = async function(req, res) {
    let { isAdmin, email, password } = req.body;
    
    try {
        if (isAdmin === 'Admin') {
            const owner = await ownerModel.findOne({ email });
            if (!owner) {
                req.flash('message', 'Invalid Credentials');
                return res.redirect('/');
            }

            const checkPassword = await bcrypt.compare(password, owner.password);
            if (!checkPassword) {
                req.flash('message', 'Invalid Credentials');
                return res.redirect('/');
            }

            return res.redirect('/owner/admin');
        } else {
            const user = await userModel.findOne({ email });
            if (!user) {
                req.flash('message', 'Invalid Credentials');
                return res.redirect('/'); 
            }

            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                req.flash('message', 'Invalid Credentials');
                return res.redirect('/');
            }

            const products = await productModel.find();
            const token = generateToken(user); 
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', });
            // res.render('shop', { products });
           
            res.render('home');
        }
    } catch (error) {
        console.error("Error in /shop route:", error);
        res.status(500).send("Server error");
    }
};



module.exports.addToCart = async(req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.cart.push(req.params.id);
        await user.save();

        await user.populate('cart');

        let totalMRP = 0;
        let totalDiscount = 0;

        user.cart.forEach(item => {
            totalMRP += item.price;
            totalDiscount += (item.price * item.discount / 100); 
        });

        totalMRP = Math.round(totalMRP);
        totalDiscount = Math.round(totalDiscount);
        const donation = req.body.donation || 0;
        const platformFee = 20;
        const shippingFee = 0;
        const totalAmount = totalMRP - totalDiscount + donation + platformFee + shippingFee;

        res.status(200).render('cart' , { cartItems: user.cart ,
            totalMRP ,
            totalAmount,
            totalDiscount,
            donation
        });
    } 
    catch(error){
        console.error(error);
        res.status(500).send(error);
    }
}

module.exports.showCart = async(req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate('cart');
        
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        const cartItems = user.cart;

        let totalMRP = 0;
        let totalDiscount = 0;

        cartItems.forEach(item => {
            totalMRP += item.price;
            totalDiscount += (item.price * item.discount / 100); 
        });

        totalMRP = Math.round(totalMRP);
        totalDiscount = Math.round(totalDiscount);

        const donation = req.body.donation || 0;
        const platformFee = 20;
        const shippingFee = 0;
        const totalAmount = totalMRP - totalDiscount + donation + platformFee + shippingFee;

    
        res.render('cart', { cartItems ,
            totalMRP ,
            totalDiscount,
            totalAmount,
            donation
        });
    }
    catch(error){
        console.error(error);
        res.status(500).send(error);
    }
}

module.exports.donate = async (req , res) => {
    try {
        const donation = parseInt(req.body.donation, 10) || 0;
        
        const user = await userModel.findOne({ email: req.user.email }).populate('cart');
        let totalMRP = 0;
        let totalDiscount = 0;

        user.cart.forEach(item => {
            totalMRP += item.price;
            totalDiscount += (item.price * item.discount / 100); 
        });

        totalMRP = Math.round(totalMRP);
        totalDiscount = Math.round(totalDiscount);

        const platformFee = 20;
        const shippingFee = 0;
        const totalAmount = totalMRP - totalDiscount + donation + platformFee + shippingFee;

        res.render('cart', { 
            cartItems: user.cart, 
            totalMRP, 
            totalDiscount, 
            donation, 
            totalAmount 
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong, please try again.');
    }
}

module.exports.deleteFromCart = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).send('User is not authenticated');
        }

        const user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.cart = user.cart.filter(item => item.toString() !== req.params.id);

        await user.save();
        await user.populate('cart');

        let totalMRP = 0;
        let totalDiscount = 0;
    
        user.cart.forEach(item => {
            totalMRP += item.price;
            totalDiscount += (item.price * item.discount / 100); 
        });

        totalMRP = Math.round(totalMRP);
        totalDiscount = Math.round(totalDiscount);

        const donation = 20; 
        const platformFee = 20;
        const shippingFee = 0;
        const totalAmount = (totalMRP - totalDiscount) + donation + platformFee + shippingFee;


        res.status(200).render('cart', { 
            cartItems: user.cart, 
            totalMRP, 
            totalDiscount, 
            donation, 
            totalAmount 
            });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

module.exports.returnToHome = async(req, res) => {
    try {
        const products = await productModel.find();  

        res.render('shop', { products });
    }
    catch(error){
        console.error(error);
        res.status(500).send(error);
    }
}
