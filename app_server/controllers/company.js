const request = require('request');

const apiOptions = {
    server: 'http://localhost:3000'
}
if(process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://accsight.herokuapp.com';
}

const showCompanyForm = (req, res) => {
    res.render('company-details', {
        title: `Load Company on AQIS`,
        pageHeader: {
            title: `Load Company`,
            strapline: 'Add company details'
        }
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

;


const addCompany = (req, res) => {
    const path = '/api/company';
    const postData = {
        name: req.body.name,
        tagline: req.body.tagline,
        address: req.body.address,
        contacts: req.body.contacts,
        website: req.body.website,
        email: req.body.email,
        bank: req.body.bank,
        branch: req.body.branch,
        //accountNo: req.body.accountNo
    };
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'POST',
        json: postData
    };
    request(requestOptions, (err, {statusCode}, {name})=>{
        if(statusCode === 201) {
            res.redirect(`/companies`);
        } else if (statusCode === 400 && name && name === 'ValidationError') {
            res.redirect(`/companies/new`);
        } else {
            showError(req, res, statusCode);
        }
    });    
}

const renderCompaniesPage = (req, res, comps) =>{
    res.render('company-list', {
        title: `AQIS Companies`,
        pageHeader: {
            title: `Company List`,
            strapline: 'Companies that use the services of AQIS'
        },
        companies: comps
    })
}

const listCompanies = (req, res) => {
    console.log('listing companies...');
    const path = '/api/companies';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
    };
    request(requestOptions, (err, {statusCode}, companies)=>{
        if(statusCode === 200) {
            renderCompaniesPage(req, res, companies);
        } else {
            showError(req, res, statusCode);
        }
    });  

};

const removeCompany = (req, res) => {
    console.log('removing...');
    const path = `/api/companies/${req.params.companyId}/del`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'DELETE',   
        json: {}
    };
    request(requestOptions, (err, {statusCode}, company)=>{
        if(statusCode === 204) {
            res.redirect(`/companies`);
        } else {
            showError(req, res, statusCode);
        }
    });  
};

module.exports = {
    showCompanyForm,
    addCompany,
    listCompanies,
    removeCompany
};