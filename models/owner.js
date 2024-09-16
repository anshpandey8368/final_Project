const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
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
    product: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: {
        type: Array,
        default: []
    },
    picture: {
        type: String,
    },
    gstin: {
        type: String,
    }
});

module.exports = mongoose.model('Owner', ownerSchema);
