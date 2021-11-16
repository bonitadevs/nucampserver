const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Currency will not work on my computer. Keep getting dependency errors
// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency;



const promotionSchema = new Schema({


    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,            
        required: true
        },
    featured: {
        type: Boolean,
        default: false
        },

        cost: {
            type: Number, //Mongoose Currency will not install on my computer.
            required: true,
            min: 0
        },

    description: {
        type: String,
        required: true
    },
    
},
    {
        timestamps: true
    });

    const Promotion = mongoose.model('Promotion', promotionSchema) 
    
    module.exports = Promotion;