const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { Comment } } = require('avarus-data')

/**
 *
 * retrieve-user
 * 
 * @param {commentId} ObjectId
 * @param {body} string
 * 
 * @returns {Object} 
 * 
 */

module.exports = function (commentId, newBody) {
    validate.string(commentId)
    validate.string.notVoid('commentId', commentId)
    if (!ObjectId.isValid(commentId)) throw new ContentError(`${commentId} is not a valid id`)
    validate.string(newBody)
    validate.string.notVoid('newBody', newBody)

    return (async () => {
        debugger
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError(`comment with id ${commentId} does not exists`)
        let update = {}
        update.body = newBody
        update.date = new Date

        debugger

        await Comment.updateOne({_id: commentId}, {$set: update})

        comment.save()

    })()
}