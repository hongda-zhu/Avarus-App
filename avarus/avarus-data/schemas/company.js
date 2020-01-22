const mongoose = require('mongoose')
const { Schema} = mongoose
const Stock = require('./stock')

module.exports = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    risk:{
        type: String,
        enum: ['adverse', 'neutral', 'seek'],
        required: true
    },
    market:{
        type: String,
        enum: ['bear', 'bull', 'neutral'],
        required: true 
    },
    category: {
        type: String,
        enum: ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion'],
        required: true
    },
    dependency: {
        type: Array
    },
    stocks: [Stock],
    versionKey: false 
})