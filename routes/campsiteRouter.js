//contains routes for all of the campsite data 

const express = require('express');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');

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
.post(authenticate.verifyUser, (req, res, next) => {
    Campsite.create(req.body) //create new campsite doc and save
    .then(campsite => {
        console.log('Campsite Created ', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite); //mongoose will check to make sure it the new doc the previously defined schema
    })
    .catch(err => next(err));
})

.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})

.delete(authenticate.verifyUser, (req, res, next) => {
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

.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})
.put(authenticate.verifyUser, (req, res, next) => {
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

.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//campsite comments 
campsiteRouter.route('/:campsiteId/comments') //looking for specific comment and not all by ID
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite) {//ask to see all comments of campsites
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments);
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite) {//access a campsite to push a comment into the comments array
            campsite.comments.push(req.body);
            campsite.save() //to save change into the MongoDB database
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite) {
            for (let i = (campsite.comments.length-1); i >= 0; i--) {
                campsite.comments.id(campsite.comments[i]._id).remove();
            } //iterate through comments array and delete the length of the array, deleting each of the comments
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//request for a specific comment id, for a specific campsite ID

campsiteRouter.route('/:campsiteId/comments/:commentId') 
.get((req, res, next) => {
    Campsite.findById(req.params.campsiteId) //what ID to look for.
    .then(campsite => {
        if (campsite && campsite.comments.id(req.params.commentId)) { //checked if truthvalue for this comment
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) { //handle if campsite is not found
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else { //comment is not availble
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`); //not supported
})
.put(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
            if (req.body.rating) {
                campsite.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
                campsite.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
            campsite.comments.id(req.params.commentId).remove();
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if (!campsite) {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = campsiteRouter;//export campsiteRouter to use in the server.js