const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { User, Comment, Transaction } } = require('avarus-data')
const moment = require('moment')

/**
 *
 * create comment
 * 
 * @param {userId} ObjectId
 * @param {transactionId} ObjectId
 * 
 * @returns {Array} comments
 * 
 */

module.exports = function (userId, transactionId) { 

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(transactionId)
    validate.string.notVoid('transactionId', transactionId)
    if (!ObjectId.isValid(transactionId)) throw new ContentError(`${transactionId} is not a valid id`)
    

    return (async () => { 

        const user = await User.findById(userId)

        if(!user) throw new NotFoundError(`user with id ${userId} does not exists`)

        const transaction = await Transaction.findById( transactionId )

        if (!transaction) throw new NotFoundError(`transaction with id ${transactionId} does not exists`)

        const allComments = await Comment.find().lean()
        
        console.log(allComments)

        const comments = await Comment.find({user:userId, transaction:transactionId})


        comments.forEach( async comment => {

            comment.id = comment._id.toString()
            delete comment._id
            delete comment.__v
            const timeCorrector = moment(comment.date).format("DD-MMM-YYYY HH:mm:ss")
            comment.date = timeCorrector

            await comment.save()
        })

        comments.sort((a, b) => (a.date > b.date) ? -1 : ((b.date > a.date) ? 1 : 0) )

        return comments
    })()
}