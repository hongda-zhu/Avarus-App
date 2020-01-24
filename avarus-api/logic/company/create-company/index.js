const { validate, errors: { ConflictError } } = require('avarus-util')
const {models: { Company } } = require('avarus-data')

/**
 *
 * create-company
 * 
 * @param {name} string
 * @param {description} string
 * @param {risk} string enum
 * @param {market} string enum 
 * @param {category} string enum 
 * @param {dependency} string array
 * @param {image} string
 * @param {stocks} array emb
 * 
 * @returns {company} Object
 */


module.exports = function (name, description, risk, market, category, dependency, image, stocks) { 
   
    validate.string(name)
    validate.string.notVoid('name', name)
    
    validate.string(description)
    validate.string.notVoid('description', description)
    
    validate.string(risk)
    validate.string.notVoid('risk', risk)
    
    validate.string(market)
    validate.string.notVoid('market', market)

    validate.string(category)
    validate.string.notVoid('category', category)
    
    validate.array(dependency)
    
    validate.string(image)
    validate.string.notVoid('image', image)
    
    validate.array(stocks)
    

    return (async () => {

        const company = await Company.findOne({ name })

        if (company) throw new ConflictError(`company with name ${name} already exists`)
 
        await Company.create({ name, description, risk, market, category, dependency, image, stocks})

    })()
}