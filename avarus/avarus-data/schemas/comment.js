const mongoose = require('mongoose')
const {ObjectId, Schema} = mongoose
module.exports = new Schema({
    user: {
        type: ObjectId,
        require: true,
        ref:'User'
    },
    transaction: {
        type: ObjectId,
        require: true,
        ref:'Transaction'
    },
    body: {
        type: String, 
        require: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})