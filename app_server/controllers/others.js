const request = require('request');

const apiOptions = {
    server: 'http://localhost:3000'
};
if(process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://accsight.herokuapp.com';
}

const about = (req, res) => {
    res.render('generic-text', {
        title: 'About AQIS',
        pageHeader: {
            title: 'What is AQIS?'
        },
        content: 'AQIS was created to help businesses create quotations and invoices for their customers. The AQIS system has four cogs that help with gathering information about customers and products, quoting, invoicing and accounting.'
    });
};

const home = (req, res) => {
    res.render('home', {
        title: 'AQIS - Quote and Invoice Quickly',
        pageHeader: {
            title: 'AQIS',
            strapline: 'Automated Quoting and Invoicing System'
        },
        sideBar: 'Looking to create a quotation and invoice quickly and accurately? AQIS helps you create quotations and invoices in the quickest time possible. Perhaps print invoice, purchase order or quotation? Let AQIS help you complete daily activities with little effort.',

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

const getInvoiceById = (req, res, customer) => {
    for(var i = 0; i < customer.invoices.length; i++) {
        if(customer.invoices[i]._id === req.params.invoiceid) {
            return customer.invoices[i];
        }
    }
}

const getQuotationById = (req, res, customer) => {
    
    for(var i = 0; i < customer.quotations.length; i++) {
        
        if(customer.quotations[i]._id === req.params.quotationid) {
            return customer.quotations[i];
        }
    }
}
const getQuoteById = (customer, quotationId) => {
    
    for(var i = 0; i < customer.quotations.length; i++) {
        if(customer.quotations[i]._id === quotationId) {
            return customer.quotations[i];
        }
    }
}

const getCompanyInfo = (req, res, callback) => {
    const path = `/api/company`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, company)=>{
        if(statusCode === 200) {
            callback(req, res, company);
        } else {
            showError(req, res, statusCode);
        }
    });  

};

const doPrintQuote = (req, res, company) => {
    getCustomerInfo(req, res, (req, res, customer)=>{
        var quotation = getQuotationById(req, res, customer); 
        renderQuotationPage(req, res, company, customer, quotation);
    });
};


const printQuote = (req, res) => {
    getCompanyInfo(req, res, (req, res, company) => {
        doPrintQuote(req, res, company);
    });
};

const renderInvoicePage = (req, res, comp, cust, quote) => {
    let invDate = Date.now();
    let invId = cust.invoices.length + 1;
    res.render('print-invoice', { 
        quotation: quote,
        customer: cust,
        invoiceDate: invDate,
        invoiceId: invId,
        company: comp 
    });
}

const doPrintInvoice =  (req, res, company) => {
    getCustomerInfo(req, res, (req, res, customer)=>{
        var invoice = getInvoiceById(req, res, customer);
        var quotation = getQuoteById(customer, invoice.quotationId);
        renderInvoicePage(req, res, company, customer, quotation);
    });

};

const printInvoice = (req, res) => {
    getCompanyInfo(req, res, (req, res, company)=>{
        doPrintInvoice(req, res, company);
    });
};

const renderQuotationPage = (req, res, comp, cust, quote) => {

    res.render('print-quote', { 
        quotation: quote,
        customer: cust,
        company: comp
    });
}

const renderPOPage = (req, res, comp, cust, quote) => {
    let invDate = Date.now();
    let invId = cust.invoices.length + 1;
    res.render('print-po', { 
        quotation: quote,
        customer: cust,
        company: comp,
        invoiceDate: invDate,
        invoiceId: invId,
    });
};

const doPrintPO = (req, res, company) => {
    getCustomerInfo(req, res, (req, res, customer)=>{
        var invoice = getInvoiceById(req, res, customer);
        var quotation = getQuoteById(customer, invoice.quotationId);
        renderPOPage(req, res, company, customer, quotation);
    });
};

const printPO = (req, res) => {
    getCompanyInfo(req, res, (req, res, company)=>{
        doPrintPO(req, res, company);
    });
    
};

module.exports = {
    about,
    home,
    printQuote,
    printInvoice,
    printPO
};