//contains routes for all of the campsite data 

const express = require('express');
const Campsite = require('../models/campsite');
//updating so each method can interact with the mongoDB server and model
const campsiteRouter = express.Router();

campsiteRouter.route('/')  //drop the app word and path from parameter to chain all the routes together and remove semicolon at the end (unless last method on chain)
.get((req, res, next) => { //next function is an argument
    Campsite.find() //static method that will query database for all docs using the campsite model
    .then(campsites => { //access the results from .find()
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsites); //will send json data to client and close client
    })
    .catch(err => next(err)); //pass off error to overall handle error built into express
})
.post((req, res, next) => {
    Campsite.create(req.body) //create new campsite doc and save
    .then(campsite => {
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); //mongoose will check to make sure it the new doc the previously defined schema
    })
    .catch(err => next(err));
})

.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete((req, res, next) => {
    Campsite.deleteMany() //will delete every document in the campsite collection
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
}); //methods are chained together instead of 5 separate routes

//campsiteID requests
campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //findById is a Mongoose method
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put((req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true })
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch(err => next(err));
})

.delete((req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = campsiteRouter;//export campsiteRouter to use in the server.js