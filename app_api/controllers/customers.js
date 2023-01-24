const mongoose = require('mongoose');
const { productsCreateOne } = require('./products');
require('../models/customers');
require('../models/products');


const Cus = mongoose.model('Customer');
const Prod = mongoose.model('Product');

const customersCreateOne = (req, res) => {
   // console.log('here...');
    Cus.create({
        name: req.body.name,
        rating: req.body.rating,    
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        contact: req.body.contact
    }, (err, customer)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res,201,customer);
        }
    });
};

const sendJSONResponse = (res, stat, content) => {
    res
      .status(stat)
      .json(content);
};


const customersReadOne = (req, res) => {
    Cus
      .findById(req.params.customerid)
      .exec((err, customer)=>{
        if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer with id not found"});
            return;
        } else if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 200, customer);
      });
};

const customersUpdateOne = (req, res) => {
    if(!req.params.customerid) {
        sendJSONResponse(res, 404, {"message":"customer id required"});
        return;
    }
    Cus
      .findById(req.params.customerid)
      .select('-quotations')
      .exec((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        } else if (!customer) {
            sendJSONResponse(res, 404, {"message":"invalid customer id"});
            return;
        }
        customer.name = req.body.name;
        customer.address = req.body.address;
        customer.contact = req.body.contact;
        customer.facilities = req.body.facilities.split(",");
        customer.save((err, cus)=>{
            if(err) {
                sendJSONResponse(res, 404, err);
                return;
            }
            sendJSONResponse(res, 200, cus);
        });
      });
};
const customersDeleteOne = (req, res) => {
    const customerid = req.params.customerid;
    if(!customerid) {
        sendJSONResponse(res,404, {"message":"customer not found"});
        return;
    }
    Cus
      .findByIdAndRemove(customerid)
      .exec((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
            return;
        }
        sendJSONResponse(res, 204, null);
      });
};

const doAddQuotation = (req, res, customer)=>{
    const prod = req.body.product;
    const quant = req.body.quantity;
    customer.quotations.push({});
    const thisQuotation = customer.quotations.slice(-1).pop();
    thisQuotation.saleId = customer.quotations.length + 1;
    if(quant && prod) {
        thisQuotation.summary = `${quant} x ${prod}`;
    } else {
        thisQuotation.summary = '';
    }
    customer.save((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 201, thisQuotation);
        }
    });
};

const quotationsCreateOne = (req, res) => {
    Cus
      .findById(req.params.customerid)
      .select('quotations')
      .exec((err, customer)=>{
        if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer not found"});
            return;
        } else if(err) {
            sendJSONResponse(res, 400, err);
            return;
        }
        doAddQuotation(req, res, customer);
      });
};
const quotationsReadOne = (req, res) => {
    Cus
      .findById(req.params.customerid)
      .select('name quotations')
      .exec((err, customer)=>{
        if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer id incorrect"});
            return;
        } else if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        if(customer.quotations && customer.quotations.length > 0) {
            const thisQuotation = customer.quotations.id(req.params.quotationid);
            if(!thisQuotation) {
                sendJSONResponse(res, 404, {"message":"quotation id incorrect"});
                return;
            }
            const response = {
                customer: {
                    name: customer.name,
                    id: req.params.customerid
                },
                thisQuotation
            };
            sendJSONResponse(res, 200, response);
        } else {
            sendJSONResponse(res, 400, {"message":"no quotations found"});
        }
      });
};
const quotationsUpdateOne = (req, res) => {
    if(!req.params.customerid || !req.params.quotationid) {
        sendJSONResponse(res, 404, {"message":"customer id and quotation id both required"});
        return;
    }
    Cus
      .findById(req.params.customerid)
      .exec((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        } else if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer not found"});
            return;
        }
        if(customer.quotations && customer.quotations.length > 0) {
            const thisQuotation = customer.quotations.id(req.params.quotationid);
            if(thisQuotation) {
                thisQuotation.quoteItems = [{
                    product: req.body.p1,
                    quantity: req.body.q1      

                }, {
                    product: req.body.p2,
                    quantity: req.body.q2      
                }];
                customer.save((err, cus)=>{
                    if(err) {
                        sendJSONResponse(res, 404, err);
                        return;
                    } else {
                        sendJSONResponse(res, 200, thisQuotation);
                    }
                });

            } else {
                sendJSONResponse(res, 404, {"message":"quotation not found"})
            }
        }
      });
};

const quotationsDeleteOne = (req, res) => {
    const customerid = req.params.customerid;
    const quotationid = req.params.quotationid;
    if(!customerid || !quotationid) {
        sendJSONResponse(res, 404, {"message":"both customer id and product id required"});
        return;
    }
    Cus
      .findById(customerid)
      .select('quotations')
      .exec((err, customer)=>{
        if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer not found"});
            return;
        } else if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        if(customer.quotations && customer.quotations.length > 0) {
            if(!customer.quotations.id(quotationid)) {
                sendJSONResponse(res, 400, {"message":"quotation not found"});
            } else {
                customer.quotations.id(quotationid).remove();
                customer.save(err=>{
                    if(err) {
                        sendJSONResponse(res, 404, err);
                    } else {
                        sendJSONResponse(res, 204, null);        
                    }
                });
            }
        } else {
            sendJSONResponse(res, 400, {"message":"no quotations found"});
        }
      });
};



const doAddInvoice = (req, res, customer)=>{
    let invoiceItems = [];
    let productName = '';
    let quantity = 0;
    let invoice = {};
    let summary = '';
    let profit = 0;

    const thisQuotation = customer.quotations.id(req.params.quotationid);
    const quotationId = thisQuotation._id;
    //console.log(req.params.quotationid);
    for(let i = 0; i < thisQuotation.quoteItems.length; i++) {
        productName = thisQuotation.quoteItems[i].product;
        quantity = thisQuotation.quoteItems[i].quantity;
        summary += `${quantity} x ${productName}, `;
        profit = thisQuotation.profit;
        invoiceItems.push({
               productName,
               quantity
        });
    }
    invoice = {
        invoiceItems,
        summary,
        profit,
        quotationId
    };
    customer.invoices.push(invoice);
    customer.save((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 400, err);
        } else {
            sendJSONResponse(res, 201, thisQuotation);
        }
    });
};

const invoicesCreateOne = (req, res) => {

    Cus
    .findById(req.params.customerid)
    .exec((err, customer)=>{
      if(!customer) {
          sendJSONResponse(res, 404, {"message":"customer not found"});
          return;
      } else if(err) {
          sendJSONResponse(res, 400, err);
          return;
      }
      doAddInvoice(req, res, customer);
    });
};

const invoicesReadOne = (req, res) => {
    Cus
      .findById(req.params.customerid)
      .select('name invoices')
      .exec((err, customer)=>{
        if(!customer) {
            sendJSONResponse(res, 404, {"message":"invalid customer id"});
            return;
        } else if(err) {
            sendJSONResponse(res, 404, err);
            return;            
        }
        if(customer.invoices && customer.invoices.length > 0) {
            const thisInvoice = customer.invoices.id(req.params.invoiceid);
            if(!thisInvoice) {
                sendJSONResponse(res,404, {"message":"invalid invoice id"});
                return;
            }
            const response = {
                customer: customer.name,
                id: req.params.customerid,
                invoice: thisInvoice
            };
            sendJSONResponse(res, 200, response);
            return;
        } else {
            sendJSONResponse(res, 404, {"message":"no invoices found"});
        }
      });  
};
const invoicesUpdateOne = (req, res) => {
    if(!req.params.customerid || !req.params.invoiceid) {
        sendJSONResponse(res, 404, {"message":"customer id and invoice id both required"});
        return;
    }
    Cus
      .findById(req.params.customerid)
      .exec((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        } else if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer not found"});
            return;
        }
        if(customer.invoices && customer.invoices.length > 0) {
            const thisInvoice = customer.invoices.id(req.params.invoiceid);
            if(thisInvoice) {
                thisInvoice.invoiceItems = [{
                    product: req.body.p1,
                    quantity: req.body.q1      
                }, {
                    product: req.body.p2,
                    quantity: req.body.q2      
                }];
                customer.save((err, cus)=>{
                    if(err) {
                        sendJSONResponse(res, 404, err);
                        return;
                    } else {
                        sendJSONResponse(res, 200, thisInvoice);
                    }
                });
            } else {
                sendJSONResponse(res, 404, {"message":"invoice not found"})
            }
        }
      });
};
const invoicesDeleteOne = (req, res) => {
    const {customerid, invoiceid} = req.params;
    if(!customerid || !invoiceid) {
        sendJSONResponse(res, 404, {"message":"both customer id and invoice id required"});
        return;
    }
    Cus
      .findById(customerid)
      .select('invoices')
      .exec((err, customer)=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        } else if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer not found"});
            return;
        }
        if(customer.invoices && customer.invoices.length>0) {
            if(!customer.invoices.id(invoiceid)) {
                sendJSONResponse(res, 404, {"message":"invoice not found"});
                return;
            }
            customer.invoices.id(invoiceid).remove();
            customer.save(err=>{
                if(err) {
                    sendJSONResponse(res, 404, err);
                    return;
                }
                sendJSONResponse(res, 204, null);
            });

        } else {
            sendJSONResponse(res, 404, {"message":"no invoices to delete"});
        }
      });

};

const customersReadAll = (req, res) => {
    Cus
      .find()
      .exec((err, customers)=>{
        if(!customers) {
            sendJSONResponse(res, 404, {"message":"no customers found"});
            return;
        } else if (err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 200, customers);
      });
};

const quotationsReadAll = (req, res) => {
    Cus
    .findById(req.params.customerid)
    .select('quotations')
    .exec((err, quotations)=>{
        if(!quotations) {
            sendJSONResponse(res, 404, {"message":"quotations not found"});
            return;
        } else if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 200, quotations);
    });
};

const invoicesReadAll = (req, res) => {
    Cus
      .findById(req.params.customerid)
      .select('invoices')
      .exec((err, invoices)=>{
        if(!invoices) {
            sendJSONResponse(res, 404, {"message":"invoices not found"});
            return;
        } else if(err){
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 200, invoices);
      });
};



const doAddQuoteItem = (req, res, customer) => {
    thisQuotation = customer.quotations.id(req.params.quotationid);
    Prod
      .findOne({name: req.body.product})
      .exec((err, product)=> {
        if(!product) {
            sendJSONResponse(res, 404, {"message":"invoices not found"});
            return;
        } else if(err){
            sendJSONResponse(res, 404, err);
            return;
        }
        let currentAmount = product.selling * req.body.quantity;
        let currentExpense = product.trade * req.body.quantity;
        thisQuotation.quoteItems.push({
            product: req.body.product,
            productDescription: product.description,
            quantity: req.body.quantity,
            productAmount: product.selling,
            productExpense: product.trade,
            subTotal: currentAmount,
            subExpense: currentExpense
        });
    
        thisQuotation.amount +=  (product.selling * req.body.quantity);
        thisQuotation.expense += (product.trade * req.body.quantity);
        thisQuotation.summary += `${req.body.quantity} x ${req.body.product}, `;
        thisQuotation.profit += (product.selling - product.trade);
        customer.save(err=>{
        if(err) {
            sendJSONResponse(res, 404, err);
            return;
        }
        sendJSONResponse(res, 201, customer);
        });
      });
};

const quotationsAddQuoteItem = (req, res) => {
    Cus
      .findById(req.params.customerid)
      .exec((err, customer)=>{
        if(!customer) {
            sendJSONResponse(res, 404, {"message":"customer not found"});
            return;
        } else if(err){
            sendJSONResponse(res, 404, err);
            return;
        }
        doAddQuoteItem(req, res, customer);
      });

};

module.exports = {
    customersCreateOne,
    customersReadOne,
    customersUpdateOne,
    customersDeleteOne,
    quotationsCreateOne,
    quotationsReadOne,
    quotationsUpdateOne,
    quotationsDeleteOne,
    invoicesCreateOne,
    invoicesReadOne,
    invoicesUpdateOne,
    invoicesDeleteOne,
    quotationsReadAll,
    customersReadAll,
    invoicesReadAll,
    quotationsAddQuoteItem
};