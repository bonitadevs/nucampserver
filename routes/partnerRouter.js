//contains routes for all of the promotions data 
const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner');

partnerRouter.route('/')  

.get((req, res, next) => { //next function is an argument
    Partner.find() //static method that will query database for all docs using the campsite model
    .then(partners => { //access the results from .find()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners); //will send json data to client and close client
    })
    .catch(err => next(err)); //pass off error to overall handle error built into express
})
.post((req, res, next) => {
    Partner.create(req.body) //create new campsite doc and save
    .then(partner => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner); //mongoose will check to make sure it the new doc the previously defined schema
    })
    .catch(err => next(err));
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res, next) => {
    Partner.deleteMany() 
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
}); 

//partnerID requests
partnerRouter.route('/:partnerId') 
.get((req, res, next) => {
    Partner.findById(req.params.partnerId) //findById is a Mongoose method
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`);
})
.put((req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, { new: true })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})

.delete((req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});



module.exports = partnerRouter;//export partnerRouter to use in the app.js