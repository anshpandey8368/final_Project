const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.flash('error', "You need to login first");
        return res.redirect('/');
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await userModel.findById(decoded.userId).select("-password"); 
        if (!user) {
            req.flash("error", "User not found");
            return res.redirect('/');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            req.flash("error", "Your session has expired. Please log in again.");
        } else {
            req.flash("error", "Authentication failed. Please log in again.");
        }
        return res.redirect('/');
    }
}
