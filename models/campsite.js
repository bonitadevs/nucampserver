// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;

//where we will define schema and models for the campsite database

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: { //contains a path to the image 
        type: String,
        required: true
    },
    elevation: { 
        type: Number,
        required: true
    },
    cost: {
        type: String,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema] //comment sub-document
}, {
    timestamps: true
});
//first argument is the object of required properties of the Schema , second argument is optional that will add a timestamp and will be given "created at" and "updated at" properties

const Campsite = mongoose.model('Campsite', campsiteSchema) //Campsite Model is created and first argument is "Campsite" of the name of collection to be used for this model. Mongo will look for lower case plural version for the collection. Then pass in the Schema used for this collection 

//for a Model, a constructor function is returned

module.exports = Campsite;