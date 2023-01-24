const request = require('request');

const prodCtrl = require('./products');

const apiOptions = {
    server: 'http://localhost:3000'
};
if(process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://accsight.herokuapp.com';
}

const renderCustomerList = (req, res, responseCustomers) => {
    let message = null;
    if(!(responseCustomers instanceof Array)) {
        message = 'API lookup error';
        responseCustomers = [];
    } else if(!responseCustomers.length) {
        message = 'No customers found';
    }
    res.render('customer-list', { 
        title: 'AQIS - Customers',
        pageHeader: {
            title: 'AQIS',
            strapline: 'Our Customers'
        },
        sideBar: 'Looking to create a quotation and invoice quickly and accurately? AQIS helps you create quotations and invoices in the quickest time possible. Perhaps print invoice, purchase order or quotation? Let AQIS help you complete daily activities with little effort.',
        customers: responseCustomers.reverse(),
        message
    });
};

const showError = (req, res, sc) => {
    let title = '';
    let content = '';
    if(sc === 404) {
        title = '404, page not found';
        content = 'Oh dear, looks like you can\'t get this page, sorry.';
    } else {
        title = `${sc}, something has gone wrong`;
        content = 'something, somewhere has gone wrong';
    }
    res.status(sc);
    res.render('generic-text', {
        title,
        content
    });
};

const customerList = function(req, res) {
    const path = '/api/customers';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, response, body)=>{
        if(response.statusCode === 200) {
            renderCustomerList(req, res, body);
        } else {
            showError(req, res, response.statusCode);
        }
    });    
};

const renderCustomerInfo = (req, res, responseCustomer) => {
    const thisQuote = responseCustomer.quotations.slice(-1).pop();
    res.render('customer-info', {
        title: responseCustomer.name,
        pageHeader: {
            title: responseCustomer.name
        },
        customer: responseCustomer,
        quotation: thisQuote,
        sideBar: {
            context: ' is on AQIS because they made an enquiry about our services',
            callToAction: 'If you\'ve used our services and you like it - or don\'t - please leave a review to help other people like you'
        }
    });
};

const getCustomerInfo = (req, res, callback) => {
    const path = `/api/customers/${req.params.customerid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, customer)=>{
        if(statusCode === 200) {
            callback(req, res, customer);
        } else {
            showError(req, res, statusCode);
        }
    });  
};

const customerInfo = (req, res) => {
    getCustomerInfo(req, res, (req, res, responseData)=>{
        renderCustomerInfo(res, res, responseData);
    });
};


const doRenderQuotationPage = (req, res, cust, prods) => {
    const thisQuotation = cust.quotations.slice(-1).pop();
    res.render('customer-quotation-page', {
        title: `Quote ${cust.name} on AQIS`,
        pageHeader: {
            title: `Quote ${cust.name}`,
        },
        customer: cust,
        quotation: thisQuotation,
        products: prods
    });
   // 
};

const renderQuotationPage = (req, res, cust) => {
    console.log(cust._id);
    const path = '/api/products';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, products)=>{
        if(statusCode === 200 && products.length) {
            doRenderQuotationPage(req, res, cust, products);
        } else {
            showError(req, res, response.statusCode);
        }
    });
};

const addQuotation = (req, res) => {
    
    getCustomerInfo(req, res, (req, res, responseData)=>{
        createQuotation(res, res, responseData);
    }); 
};

const createQuotation = (req, res, customer) => {
    console.log('creating quote...');
    const path = `/api/customers/${customer._id}/quotations`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, quotation)=>{
        if(statusCode === 201) {
            renderQuotationPage(req, res, customer);
        } else {
            showError(req, res, statusCode);
        }
    });
};


const createInvoice = (req, res) => {
    const path = `/api/customers/${req.params.customerid}/quotations/${req.params.quotationid}/invoice`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, invoice)=>{
        if(statusCode === 201) {
            res.redirect(`/customers/${req.params.customerid}`);
        } else {
            showError(req, res, statusCode);
        }
    });
};



const addInvoice = (req, res) => {
    getCustomerInfo(req, res, (req, res, responseData)=>{
        createInvoice(res, res, responseData);
    }); 
};


const doAddInvoice = (req, res) => {
    const customerid = req.params.customerid;
    const path = `/api/customers/${customerid}/invoices`;
    const postData = {
        quoteId: req.body.name
    };
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, quotation)=>{
        if(statusCode === 201) {
            res.redirect(`/customers/${customerid}`);
        } else {
            showError(req, res, statusCode);
        }
    });
    
};

const doAddQuoteItem = (req, res, customer) => {
    const path = `/api/customers/${req.params.customerid}/quotations/${customer.quotations.slice(-1).pop()._id}`;
    const postData = {
        product: req.body.product,
        quantity: req.body.quantity
    };
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, response)=>{
        if(statusCode === 201) {
            //a redirect is a get request
            res.redirect(`/customers/${req.params.customerid}/quotations`);
        } else {
            showError(req, res, statusCode);
        }
    });  
};

const addQuoteItem = (req, res) => {
    getCustomerInfo(req, res, (req, res, responseData)=> {
        doAddQuoteItem(req, res, responseData);
    });
};

const saveQuotation = (req, res) => {
    console.log('saving quotation...');
    res.redirect(`/customers/${req.params.customerid}`);
};

const showQuotationPage = (req, res) => {
    getCustomerInfo(req, res, (req, res, responseData)=>{
        renderQuotationPage(res, res, responseData);
    }); 

};

const deleteQuotation = (req, res) => {
    const path = `/api/customers/${req.params.customerid}/quotations/${req.params.quotationid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, response) => {
        if(statusCode === 204) {
            res.redirect(`/customers/${req.params.customerid}`);
        } else {
            showError(req, res, statusCode);
        }
    });

};

const createNewCustomer = (req, res) => {
    const path = `/api/customers`;
    const postData = {
        name: req.body.name,
        rating: req.body.rating,
        contact: req.body.contact,
        address: req.body.address,
        facilities: req.body.facilities
    };
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    if(!postData.name || !postData.rating || !postData.contact || !postData.address || !postData.facilities) {
        res.redirect('/customers/new/one?err=val'); 
    } else {
        request(requestOptions, (err, {statusCode}, {name})=>{
            if(statusCode === 201) {
                res.redirect(`/customers`);
            } else if (statusCode === 400 && name && name === 'ValidationError') {
                res.redirect('/customers');
            } else {
                showError(req, res, statusCode);
            }
        });    
    }
};

const renderCustomerForm = (req, res) => {
    res.render('customer-form', {
        title: 'Add New Customer',
        pageHeader: {
            title: 'Add Customer',
            strapline: 'Add new customer to database'
        },
        error: req.query.err
    });
};

const openCustomerForm = (req, res) => {
    renderCustomerForm(req, res);
};

const deleteCustomer = (req, res) => {
    const path = `/api/customers/${req.params.customerid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, response)=>{
        if(statusCode === 204) {
            res.redirect('/customers');
        } else {
            showError(req, res, statusCode);
        }
    });

};

const deleteInvoice = (req, res) => {
    const path = `/api/customers/${req.params.customerid}/invoices/${req.params.invoiceid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, response)=>{
        if(statusCode === 204) {
            res.redirect(`/customers/${req.params.customerid}`);
        } else {
            showError(req, res, statusCode);
        }
    });
};

const doRemoveNullQuote = (req, res, customer, quotation) => {
    const path = `/api/customers/${customer._id}/quotations/${quotation._id}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, response) => {
        if(statusCode === 204) {
            showError(req, res, 204);
           // res.redirect(`/customers/${customer._id}`);
        } else {
            showError(req, res, statusCode);
        }
    });


};

const removeNullQuote = (req, res, customer) => {
    
    for(var i = 0; i < customer.quotations.length; i++) {
        if(customer.quotations[i].amount === 0) {
            doRemoveNullQuote(req, res, customer, customer.quotations[i]);
        }
    }
};

const submitQuote = (req, res) => {
    getCustomerInfo(req, res, (req, res, customer)=>{
        removeNullQuote(req, res, customer);
    }); 
};

module.exports = {
    customerList,
    customerInfo,
    addQuotation,
    addInvoice,
    doAddInvoice,
    addQuoteItem,
    saveQuotation,
    showQuotationPage,
    deleteQuotation,
    createNewCustomer,
    openCustomerForm,
    deleteCustomer,
    createInvoice,
    deleteInvoice,
    submitQuote
};