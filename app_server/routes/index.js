var express = require('express');
var router = express.Router();

const ctrlCustomers = require('../controllers/customers');
const ctrlOthers = require('../controllers/others');
const ctrlProducts = require('../controllers/products');
const ctrlCompany = require('../controllers/company');
const ctrlAuth = require('../controllers/authorize')
const passport = require('passport');
const session = require('express-session');
/* GET home page. */


//ROUTES
const isLoggedIn  = (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect('/sign');
}

const isLoggedOut  = (req, res, next) => {
  if(!req.isAuthenticated()) return next();
  res.redirect('/');
}


router.get('/customers', ctrlCustomers.customerList);
router.get('/customers/:customerid', ctrlCustomers.customerInfo);


router
  .route('/customers/:customerid/quotations/new')
  .get(ctrlCustomers.addQuotation);

  router
  .route('/customers/:customerid/invoices/new')
  .get(ctrlCustomers.addInvoice);

router
  .route('/customers/:customerid/quotations')
  .get(ctrlCustomers.showQuotationPage);
 

router
  .route('/customers/:customerid/quotations/new')
  .post(ctrlCustomers.addQuoteItem)
  .get(ctrlCustomers.saveQuotation);

  router
  .route('/customers/:customerid/quotations/done')
  .get(ctrlCustomers.submitQuote);



router
  .route('/customers/:customerid/quotations/:quotationid/invoice')
  .get(ctrlCustomers.createInvoice);


router
  .route('/customers/:customerid/quotations/:quotationid/del')
  .get(ctrlCustomers.deleteQuotation);

router
  .route('/customers/:customerid/invoices/:invoiceid/del')
  .get(ctrlCustomers.deleteInvoice);

router
  .route('/customers/new/one')
  .get(ctrlCustomers.openCustomerForm)
  .post(ctrlCustomers.createNewCustomer);

  router
  .route('/products/new/one')
  .get(ctrlProducts.openProductForm)
  .post(ctrlProducts.createProduct);

router
  .route('/customers/:customerid/del')
  .get(ctrlCustomers.deleteCustomer)

  router
  .route('/products/:productid/del')
  .get(ctrlProducts.deleteProduct);


router
  .route('/customers/:customerid/invoices/new')
  .get(ctrlCustomers.addInvoice)
  .post(ctrlCustomers.doAddInvoice);

router.get('/about', isLoggedIn, ctrlOthers.about);
//router.get('/', ctrlOthers.home);

router.get('/products', ctrlProducts.productList);
router.get('/products/:productid', ctrlProducts.productInfo);

//we need to call the createQuote action on the others controller when
router
  .route('/customers/:customerid/quotations/:quotationid/print')
  .get(ctrlOthers.printQuote);

  router
  .route('/customers/:customerid/invoices/:invoiceid/print')
  .get(ctrlOthers.printInvoice);

router
  .route('/company')
  .post(ctrlCompany.addCompany);

router
  .route('/companies')
  .get(ctrlCompany.listCompanies);

router.get('/companies/:companyId/del', ctrlCompany.removeCompany);
router.get('/companies/new', ctrlCompany.showCompanyForm);

router.get('/customers/:customerid/invoices/:invoiceid/po', ctrlOthers.printPO);

router.get('/register', ctrlAuth.showRegPage);

router.post('/users', ctrlAuth.registerUser);

router.get('/sign', ctrlAuth.showLogInPage);
router.post('/sign', ctrlAuth.logInUser);

router.get('/', ctrlOthers.home);

router.get('/sign', isLoggedOut, ctrlAuth.showLogInPage);

//router.post('/sign',);

router.get('/signout', ctrlAuth.logout);
  

module.exports = router;
