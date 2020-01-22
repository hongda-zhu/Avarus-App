const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { User } } = require('avarus-data')

/**
 *
 * retrieve-user
 * 
 * @param {id} ObjectId
 * 
 * @returns {Object} 
 * 
 */

module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        
        const usercase = await (await User.findById(id)
        .populate('favorites')
        .populate({path:'transactions', populate: {path:'user company stock'}}))
        
        if (!usercase) throw new NotFoundError(`usercase with id ${id} not found`)
        
        const { name, surname, username, email, budget, favorites, transactions, image} = usercase

        favorites.forEach(favorite => {

            if(!favorite.id) favorite.id = favorite._id
            
            delete favorite._id

            favorite.save()

        })

        

        await usercase.save()

        return { id, name, surname, username, email, budget, favorites, transactions, image }
    })()
}