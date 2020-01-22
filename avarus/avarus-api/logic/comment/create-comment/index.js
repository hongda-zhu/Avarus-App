const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { User, Comment, Transaction } } = require('avarus-data')

/**
 *
 * create comment
 * 
 * @param {userId} ObjectId
 * @param {transactionId} ObjectId
 * @param {body} string
 * 
 * @returns {Object} comment
 * 
 */

module.exports = function (userId, transactionId, body) {
    
    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(transactionId)
    validate.string.notVoid('transactionId', transactionId)
    if (!ObjectId.isValid(transactionId)) throw new ContentError(`${transactionId} is not a valid id`)

    validate.string(body)
    validate.string.notVoid('body', body)


    return (async () => {
        debugger
        const user = await User.findById( userId )
        
        if (!user) throw new NotFoundError(`user with id ${userId} does not exists`)

        const transaction = await Transaction.findById( transactionId )

        if (!transaction) throw new NotFoundError(`transaction with id ${transactionId} does not exists`)

        const comment = await Comment.create({user: userId, transaction: transactionId, body, date: new Date})

        return comment

    })()
}