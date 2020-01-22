const { validate, errors: {NotFoundError } } = require('avarus-util')
const { ObjectId, models: { Company } } = require('avarus-data')

/**
 *
 * edit-price
 * 
 * @param {id} ObjectId
 * @param {price} number
 * @param {description} string
 * @param {risk} string enum
 * @param {market} string enum
 * @param {dependency} array enum
 * @param {image} string
 * @param {stocks} array emb
 * 
 */

module.exports = function(id, name, description, risk, market, category, dependency, image, stocks) {

  validate.string(id)
  validate.string.notVoid('id', id)

  if (name) {
    validate.string(name)
    validate.string.notVoid('name', name)
  }

  if (description) {
    validate.string(description)
    validate.string.notVoid('description', description)
  }

  if (risk) {
    validate.string.notVoid('risk', risk)
    validate.string(risk)
  }


  if (market) {
    validate.string(market)
    validate.string.notVoid('market', market)
  }

  if (dependency) {
    validate.array(dependency)
  }

  if (image) {
    validate.string.notVoid('image', image)
    validate.string(image)
  }

  if (stocks) {
    validate.array(stocks)
  }

  return (async () => {
    const company = await Company.findById(id)

    if (!company) throw new NotFoundError(`company with id ${id} not found`)

    const update = {}

    name && (update.name = name)
    description && (update.description = description)
    risk && (update.risk = risk)
    market && (update.market = market)
    category && (update.category = category)
    dependency && (update.dependency = dependency)
    image && (update.image = image)
    stocks && (update.stocks = stocks)
    
    update.lastAccess = new Date

    await Company.updateOne({ _id: ObjectId(id) }, { $set: update })
  })()
}