const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { User, Company } } = require('avarus-data')

/**
 *
 * retrieve company
 * 
 * @param {ObjectId} companyId = company id
 * @param {ObjectId} userId = user id 
 * 
 * @return {Promise} 
 * @return {Object} return the complete information of company 
 * 
 */

module.exports = function (companyId, userId) {
    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)
    if (!ObjectId.isValid(companyId)) throw new ContentError(`${companyId} is not a valid company id`)

    if (userId) {
        validate.string(userId)
        validate.string.notVoid('userId', userId)
        if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid user id`)
    }

    return (async () => { 
        const company = await Company.findById(companyId)

        if (!company) throw new NotFoundError(`company with companyId ${companyId} not found`)

        await company.save()

        const { name, description, risk, market, category, dependency, image, stocks } = company

        let isFav = undefined

        if(userId){
            const user = await User.findById(userId)
            if(!user) throw new NotFoundError(`user with userId ${userId} not found`)
            isFav = user.favorites.includes(companyId)
        }

        return { companyId, name, description, risk, market, category, dependency, image, stocks, isFav }
    })()
}