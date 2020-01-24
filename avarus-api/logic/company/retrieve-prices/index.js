const { validate, errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, models: { Company } } = require('avarus-data')
const moment = require('moment')

/**
 *
 * retrieve the prices
 * 
 * @returns {ObjectId} 
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

        const { stocks } = company

        const stocksSliced = stocks.slice(0)

        stocksSliced.sort(function(a, b){
            return a.price - b.price;
        })

        let lowerPrice = parseFloat((stocksSliced[0].price).toFixed(3))

        let higherPrice = parseFloat((stocksSliced[stocksSliced.length - 1].price).toFixed(3))

        let averagePrice = parseFloat((stocksSliced.reduce((total, next) => total + next.price, 0) / stocksSliced.length).toFixed(3))

        return { lowerPrice, higherPrice, averagePrice }
        
    })()
}