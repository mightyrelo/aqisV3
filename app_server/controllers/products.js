const request = require('request');
const apiOptions = {
    server: 'http://localhost:3000'
};

if(process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://accsight.herokuapp.com';
}

const renderProductList = (req, res, responseProducts) => {
    let message = null;
    if(!(responseProducts instanceof Array)) {
        message = 'API lookup error';
        responseProducts = [];
    } else if(!responseProducts.length) {
        message = 'No products found'
    }
    res.render('product-list', {
        title: "AQIS Products",
        pageHeader: {
            title: 'AQIS',
            strapline: 'AccSight Products'
        },
        sideBar: 'Looking to create a quotation and invoice quickly and accurately? AQIS helps you create quotations and invoices in the quickest time possible. Perhaps print invoice, purchase order or quotation? Let AQIS help you complete daily activities with little effort.',
        products: responseProducts.reverse(),
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


const productList = (req, res)=> {
    const path = '/api/products';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, products)=>{
        if(statusCode === 200 && products.length) {
            renderProductList(req, res, products);
        } else {
            showError(req, res, response.statusCode);
        }
    });
};

const renderProductInfo = (req, res, responseProduct) => {
    res.render('product-info', {
        title: responseProduct.name,
        pageHeader: {
            title: responseProduct.name,
            strapline: 'Sliding Gate Operator'
        },
        sideBar: {
            content: ' is on AQIS because it\'s a good product that comes at an affordable price',
            callToAction: 'If you\'ve used our services and you like it - or don\'t - please leave a review to help other people like you'
        },
        product: responseProduct
    });
};

const productInfo = (req, res)=> {
    const path = `/api/products/${req.params.productid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, product)=>{
        if(statusCode === 200) {
            renderProductInfo(req, res, product);
        } else {
            showError(req, res, statusCode);
        }
    });
   
};

const renderProductForm = (req, res) => {
    res.render('product-form', {
        title: 'Add New Product',
        pageHeader: {
            title: 'Add Product',
            strapline: 'Add new product to database'
        },
        error: req.query.err
    });
};

const openProductForm = (req, res) => {
    renderProductForm(req, res);
};


const createProduct = (req, res) => {
    const path = `/api/products`;
    const postData = {
        name: req.body.name,
        description: req.body.description,
        rating: req.body.rating,
        retail: req.body.retail,
        trade: req.body.trade,
        selling: req.body.selling
    };
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    if(!postData.name || !postData.description || !postData.retail || !postData.trade || !postData.selling) {
        console.log('rain');
        res.redirect('/products/new/one?err=val'); 
    } else {
        request(requestOptions, (err, {statusCode}, {name})=>{
            if(statusCode === 201) {
                res.redirect(`/products`);
            } else if (statusCode === 400 && name && name === 'ValidationError') {
                res.redirect('/products/new/one?err=val');
            } else {
                showError(req, res, statusCode);
            }
        });    
    }
};

const deleteProduct = (req, res) => {
    const path = `/api/products/${req.params.productid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, response)=>{
        if(statusCode === 204) {
            res.redirect('/products');
        } else {
            showError(req, res, statusCode);
        }
    });
};

module.exports = {
    productList,
    productInfo,
    openProductForm,
    createProduct,
    deleteProduct
};