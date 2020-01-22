const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { Comment } } = require('avarus-data')

/**
 *
 * delete comment
 * 
 * @param {commentId} ObjectId 
 * 
 * @returns {Object} comment
 * 
 */

module.exports = function (commentId) {

    validate.string(commentId)
    validate.string.notVoid('commentId', commentId)
    if (!ObjectId.isValid(commentId)) throw new ContentError(`${commentId} is not a valid id`)

    return (async () => {
        
        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError(`comment with id ${commentId} does not exists`)

        await Comment.deleteOne({_id : commentId})

        const shouldNotExistComment = await Comment.findById(commentId)
        if (shouldNotExistComment) throw new ConflictError(`database´s error`)

    })()
}