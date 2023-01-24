const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    retail: {
        type: Number,
        required: true
    },
    trade: {
        type: String,
        required: true
    },
    selling: {
        type: String,
        required: true
    },
    inStock: Number,
});

mongoose.model('Product',productSchema);