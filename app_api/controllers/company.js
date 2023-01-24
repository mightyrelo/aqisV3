const mongoose = require('mongoose');
require('../models/company');

//here is where we actually create an object from the model
//this is defining a model in this context. It's like defining a class
const Company = mongoose.model('Company');


const sendJSONResponse = (res, stat, content) => {
    res
      .status(stat)
      .json(content);
};

const companiesCreateOne = (req, res) => {
    
    Company.create({
        name: req.body.name,
        tagline: req.body.tagline,
        address: req.body.address,
        contacts: req.body.contacts,
        website: req.body.website,
        email: req.body.email,
        bank: req.body.bank,
        branch: req.body.branch,
    }, (err, company)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 201, company);
        }
    });
};

const companiesReadOne = (req, res) => {
    Company
      .findById("63563a51f2aebf78da7348a7")
      .exec((err, company)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 200, company);
        }
      });
};

const companiesReadAll = (req, res) => {
    Company
      .find()
      .exec((err, companies)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 200, companies);
        }
      });
}

const companiesDeleteOne = (req, res) => {
    const compId = req.params.companyId;
    Company
      .findByIdAndDelete(compId)
      .exec((err, companies)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 204, null);
        }
      });
}

module.exports = {
    companiesCreateOne,
    companiesReadOne,
    companiesReadAll,
    companiesDeleteOne
};

