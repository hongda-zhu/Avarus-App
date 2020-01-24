const mongoose = require('mongoose')
const {Schema} = mongoose

module.exports = new Schema({
    price: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        required: true
    }
})