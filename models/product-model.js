const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    image: {
        type: Buffer,
    },
    bgColor: {
        type: String,
        required: true
    },
    panelColor: {
        type: String,
        required: true
    },
    textColor: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
