const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    images: {
        type: String, // Array of image URLs
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false // Optional field
    },
    mrp: {
        type: Number,
        required: false // Optional field
    }
}, {versionKey: false});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
