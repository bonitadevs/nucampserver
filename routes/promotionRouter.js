//contains routes for all of the promotions data 

const express = require('express');
const promotionRouter = express.Router();
const Promotion = require('../models/promotion');


promotionRouter.route('/')  

.get((req, res, next) => { //next function is an argument
    Promotion.find() //static method that will query database for all docs using the campsite model
    .then(promotions => { //access the results from .find()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions); //will send json data to client and close client
    })
    .catch(err => next(err)); //pass off error to overall handle error built into express
})
.post((req, res, next) => {
    Promotion.create(req.body) //create new campsite doc and save
    .then(promotion => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion); //mongoose will check to make sure it the new doc the previously defined schema
    })
    .catch(err => next(err));
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotion.deleteMany() 
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
}); 

//partnerID requests
promotionRouter.route('/:promotionId') 
.get((req, res, next) => {
    Promotion.findById(req.params.promotionId) //findById is a Mongoose method
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, { new: true })
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    })
    .catch(err => next(err));
})

.delete((req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});



module.exports = promotionRouter;//export partnerRouter to use in the app.js