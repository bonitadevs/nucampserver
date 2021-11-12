//contains routes for all of the promotions data 

const express = require('express');
const promotionsRouter = express.Router();

promotionsRouter.route('/')  //drop the app word and path from parameter to chain all the routes together and remove semicolon at the end (unless last method on chain)
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the promotions to you');
})
.post((req, res) => {
    res.end(`Will add the promoter: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    res.end('Deleting all promotions');
}) //methods are chained together instead of 5 separate routes

//campsiteID requests
promotionsRouter.route('/:promotionId')  

.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res) => {
    res.end(`Will send details of the promoter: ${req.params.promotionId} to you`);
})

.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

.put((req, res) => {
    res.write(`Updating the promoter: ${req.params.promotionId}\n`);
    res.end(`Will update the promoter: ${req.body.name}
        with description: ${req.body.description}`);
})

.delete((req, res) => {
    res.end(`Deleting promoter: ${req.params.promotionId}`);
});


module.exports = promotionsRouter; //export promotionsRouter to use in the server.js