const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    orders: {
        type: Array,
        default: []
    },
    contact: {
        type: Number,
        // required: true,
    },
    picture: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);
