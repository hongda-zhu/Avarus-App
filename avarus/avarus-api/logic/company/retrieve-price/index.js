const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { Company } } = require('avarus-data')

/**
 *
 * retrieve price
 * 
 * @param {id} ObjectId
 * 
 * @returns {Array} 
 * 
 */


module.exports = function (id) {
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

    return (async () => {
        const company = await Company.findById(id)

        if (!company) throw new NotFoundError(`company with id ${id} not found`)

        await company.save()

        const {stocks} = company.toObject()

        stocks.forEach(stock => {

            stock.id = stock._id.toString()
            delete stock._id
            delete stock.__v
            
        })

        return stocks
    })()
}