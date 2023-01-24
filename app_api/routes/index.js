var express = require('express');
var router = express.Router();

const customersCtrl = require('../controllers/customers');
const productsCtrl = require('../controllers/products');
const companyCtrl = require('../controllers/company');
const authCtrl = require('../controllers/authController');

/* GET home page. */

router
  .route('/customers')
  .get(customersCtrl.customersReadAll)
  .post(customersCtrl.customersCreateOne);

router
  .route('/customers/:customerid')
  .get(customersCtrl.customersReadOne)
  .put(customersCtrl.customersUpdateOne)
  .delete(customersCtrl.customersDeleteOne);

  router
  .route('/customers/:customerid/quotations')
  .get(customersCtrl.quotationsReadAll)
  .post(customersCtrl.quotationsCreateOne);


router
  .route('/customers/:customerid/quotations/:quotationid')
  .get(customersCtrl.quotationsReadOne)
  .put(customersCtrl.quotationsUpdateOne)
  .delete(customersCtrl.quotationsDeleteOne)
  .post(customersCtrl.quotationsAddQuoteItem);

router
  .route('/customers/:customerid/invoices')
  .get(customersCtrl.invoicesReadAll);

router.post('/customers/:customerid/quotations/:quotationid/invoice', customersCtrl.invoicesCreateOne);


router
  .route('/customers/:customerid/invoices/:invoiceid')
  .get(customersCtrl.invoicesReadOne)
  .put(customersCtrl.invoicesUpdateOne)
  .delete(customersCtrl.invoicesDeleteOne);

router
  .route('/products')
  .get(productsCtrl.productsReadAll)
  .post(productsCtrl.productsCreateOne)

router
  .route('/products/:productid')
  .get(productsCtrl.productsReadOne)
  .put(productsCtrl.productsUpdateOne)
  .delete(productsCtrl.productsDeleteOne)

router
  .route('/company')
  .post(companyCtrl.companiesCreateOne)
  .get(companyCtrl.companiesReadOne);

router
  .route('/companies')
  .get(companyCtrl.companiesReadAll);

router
  .route('/companies/:companyId/del')
  .delete(companyCtrl.companiesDeleteOne);

router
  .route('/users')
  .post(authCtrl.register);

router
  .route('/sign')
  .post(authCtrl.logInUser);



module.exports = router;
