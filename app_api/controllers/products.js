const mongoose = require('mongoose');
require('../models/products');
const Prod = mongoose.model('Product');

const sendJSONResponse = (res, stat, content) => {
    res
      .status(stat)
      .json(content);
};


const productsCreateOne = (req, res) => {
    Prod.create({
        name: req.body.name,
        description: req.body.description,
        retail: req.body.retail,
        trade: req.body.trade,
        selling: req.body.selling
    },(err, product)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 201, product);
        }
    });
};

const productsReadOne = (req, res) => {
    Prod
      .findById(req.params.productid)
      .exec((err, product)=>{
        if(!product) {
            sendJSONResponse(res,404,{"message":"product with id not found"});
            return;
        } else if(err) {
            sendJSONResponse(res,404,err);
            return;
        }
        sendJSONResponse(res,200,product);
      });
};

const productsUpdateOne = (req, res) => {
   if(!req.params.productid) {
    sendJSONResponse(res, 404, {"message":"product id required"});
    return;
   }
   Prod
     .findById(req.params.productid)
     .exec((err, product)=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        } else if(!product) {
            sendJSONResponse(res, 404, {"message":"product id not found"});
            return;
        }
        product.name = req.body.name;
        product.description = req.body.description;
        product.retail = req.body.retail;
        product.trade = req.body.trade;
        product.selling = req.body.selling;

        product.save((err, prod)=>{
            if(err) {
                sendJSONResponse(res, 404, err);
                return;
            } else {
                sendJSONResponse(res, 200, prod);
            }
        });
     });

};
const productsDeleteOne = (req, res) => {
   const prodid = req.params.productid;
   if(!prodid) {
    sendJSONResponse(res, 404, {"message":"invalid customer id"});
    return;
   }
   Prod
     .findByIdAndRemove(prodid)
     .exec((err, product)=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 204, null);
     });

};
const productsReadAll = (req, res) => {
    Prod
      .find()
      .exec((err, products)=>{
        if(!products || products.length === 0) {
            sendJSONResponse(res, 404, {"message":"products not found"});
            return;
        } else if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 200, products);
      });

};

module.exports = {
    productsCreateOne,
    productsReadOne,
    productsUpdateOne,
    productsDeleteOne,
    productsReadAll
};