const { validate, errors: { ContentError, NotFoundError } } = require('avarus-util')
const { ObjectId, models: { Company, Stock } } = require('avarus-data')

/**
 *
 * create-price
 * 
 * @param {companyId} ObjectId
 * @param {price} number

 * @returns {stock} Object
 */


module.exports = function (companyId, price) {
    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)
    if (!ObjectId.isValid(companyId)) throw new ContentError(`${companyId} is not a valid companyId`)

    validate.number(price)


    return (async () => {  
  
        const company = await Company.findById(companyId)

        if (!company) throw new NotFoundError(`company with companyId ${companyId} not found`)

        const lastAccess = new Date()
        
        // .toISOString().replace('-', '/').split('T')[0].replace('-', '/')

        const stock = await Stock.create({price, time: lastAccess})

        delete stock.__v

        company.stocks.push(stock)

        company.save()

        return stock
    })()
}