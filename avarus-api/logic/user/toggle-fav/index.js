const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { User } } = require('avarus-data')

/**
* Toggle fav
* 
* @param {string} userId
* @param {string} companyId
* 
*/

module.exports = function (userId, companyId) {

    

    validate.string(userId)
    validate.string.notVoid('userId', userId)
    if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid id`)

    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)  
    if (!ObjectId.isValid(companyId)) throw new ContentError(`${companyId} is not a valid id`)

    return (async () => {

        
        const user = await User.findById(userId)
        if (!user) throw new NotFoundError(`user with id ${userId} not found`)
        
        const favIndex = user.favorites.indexOf(companyId)

        if(favIndex === -1) {
            user.favorites.push(companyId)
        } else {
            user.favorites.splice(favIndex, 1)
        }
        
        await user.save()
    })()
}