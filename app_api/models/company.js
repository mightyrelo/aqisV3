const mongoose = require("mongoose");

const bankingSchema = new mongoose.Schema({
    bank: {
        type: String,
        required: true
    },
    branch: {
        type: String,
    },
    accountName: {
        type: String
    },
    accountNumber: {
        type: Number
    }
});



const companySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    tagline: {
        type: String
    },
    address: {
        type: String
    },
    contacts: {
        type: String
    },
    website: {
        type: String
    },
    email: {
        type: String
    },
    bank: {
        type: String,
    },
    branch: {
        type: String,
    }
});

//compile schema to create model
mongoose.model('Company', companySchema);



