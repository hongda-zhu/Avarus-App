const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: {User, Company } } = require('avarus-data')

/**
 *
 * retrieve company by name
 * 
 * @param {query} string
 * @param {userId} objectId of user
 * 
 * @returns {Array} 
 * 
 */

module.exports = function (query, userId) {

    if (query){
        validate.string(query)
        validate.string.notVoid('query', query)
    }

    if (userId) {
        validate.string(userId)
        validate.string.notVoid('userId', userId)
        if (!ObjectId.isValid(userId)) throw new ContentError(`${userId} is not a valid user id`)
    }

    return (async () => {    

        debugger
        
        const user = await User.findById(userId)

        if(!user) throw new NotFoundError(`user with id ${userId} does not exist`)

        const companiesByQuery = await Company.find({
            
                $or:[
                    {"name": {$regex: `.*${query}*`}},
                    {"category": {$in: query}}
                ]
            
        })

        const companiesAll = await Company.find()

        let results;

        query ? results = companiesByQuery : results = companiesAll

        if(results.length === 0) throw new NotFoundError(`companies with query ${query} does not exist`)

        results.forEach(async company => { 

            company.id = company._id.toString();

            delete company._id

            company.isFav = user.favorites.includes(company.id)
            
            await company.save()
        
        })

        debugger

        return results
            
    })()
}