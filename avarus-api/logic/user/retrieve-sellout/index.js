const { validate, errors: { NotFoundError } } = require('avarus-util')
const { models: { Transaction, Sellout } } = require('avarus-data')

/**
 *
 * retrieve sell-out transaction
 * 
 * @param {id} ObjectId
 * 
 * @returns {Object} 
 * 
 */

module.exports = function (id) {

    validate.string(id)
    validate.string.notVoid('id', id)

    return (async () => { 

        const sale = await Sellout.findById( id ).populate('user company ')  

        if(!sale) throw new NotFoundError(`we can't found this sellout with id ${id}`)

        const {_id, company, stock, buyInTransaction, operation, quantity, amount, time} = sale 

        let selloutId = _id.toString()

        delete _id

        let stockId = stock.toString()
        
        const stocked = company.stocks.filter(stocke => {
            if(stocke.id === stockId) return stock
       })
       
       const stockSelected = stocked[0]
        
        return {selloutId, company, stockSelected, buyInTransaction, operation, quantity, amount, time} 
    })()

}