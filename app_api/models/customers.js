const mongoose = require('mongoose');

require('./products');

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

const quoteItemSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    subTotal: {
        type: Number
    },
    productAmount: {
        type: Number
    },
    productDescription: {
        type: String
    },
    productExpense: {
        type: Number
    },
    subExpense: {
        type: Number
    }
});

const quotationSchema = new mongoose.Schema({
    quoteItems: [quoteItemSchema],
    createdOn: {
        type: Date,
        default: Date.now
    },
    summary: String,
    amount: {
        type: Number,
        'default': 0
    },
    expense: {
        type: Number,
        'default': 0
    },
    profit: {
        type: Number,
        'default': 0
    },
    saleId: {
        type: Number,
        'default': 0
    },

});
const invoiceItemSchema = new mongoose.Schema({
    product: String,
    quantity: Number
});

const invoiceSchema = new mongoose.Schema({
    invoiceItems: [invoiceItemSchema],
    createdOn: {
        type: Date,
        default: Date.now
     },
    summary: String,
    profit: Number,
    quotationId: mongoose.Types.ObjectId
});

const serviceDateSchema = new mongoose.Schema({
    quotation: {
        type: Date,
        default: Date.now
    },
    service: {
        type: Date,
        default: Date.now
    },
    invoice: {
        type: Date,
        default: Date.now
    }

});

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        'default': 1,
        required: true

    },
    address: String,
    contact: {
        type: Number,
        required: true
    },
    facilities: [String],
    serviceDates: [serviceDateSchema],
    quotations: [quotationSchema],
    invoices: [invoiceSchema]
});

mongoose.model('Customer', customerSchema);

customerSchema.index({coords: '2dsphere'});

