const { validate, errors: { ConflictError, NotFoundError } } = require('avarus-util')
const {models: { Company, User, Stock, Transaction, Sellout } } = require('avarus-data')

/**
 *
 * create sell-out transaction
 * 
 * @param {userId} ObjectId
 * @param {companyId} ObjectId
 * @param {stockId} ObjectId
 * @param {buyInTransactionId} ObjectId
 * @param {operation} string enum
 * @param {quantity} number
 * 
 * @returns {Object} 
 * 
 */

module.exports = function (userId, companyId, stockId, buyInTransactionId, operation, quantity) { 

    validate.string(userId)
    validate.string.notVoid('userId', userId)

    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)

    validate.string(stockId)
    validate.string.notVoid('stockId', stockId)

    validate.string(buyInTransactionId)
    validate.string.notVoid('buyInTransactionId', buyInTransactionId)

    validate.string(operation)
    validate.string.notVoid('operation', operation)
    validate.matches('operation', operation, 'buy-in', 'sell-out', 'preset')
    
    validate.number(quantity)

    return (async () => {

        if(operation !== 'sell-out') throw new ConflictError(`this operation should be sell-out operation`)

        const user  = await User.findById( userId )

        if (!user) throw new NotFoundError(`user with id ${userId} does not exists`)

        const company = await Company.findById(companyId)

        if (!company) throw new NotFoundError(`company with id ${companyId} does not exists`)

        const stock = company.stocks.filter(stock => {
            if(stock.id === stockId) return stock
       })
       
       const stockSelected = stock[0]
       // const stock = await Stock.findById(stockId,  { '__v': 0 }).lean()

       if (!stockSelected) throw new NotFoundError(`stock with id ${stockId} does not exists`)

        const buyInTransaction = await Transaction.findById(buyInTransactionId)

        if(!buyInTransaction) throw new NotFoundError(`buyInTransaction with id ${buyInTransaction} does not exists`)

        let {quantity: buyInQuantity} = buyInTransaction

        if(buyInQuantity < quantity) throw new ConflictError (`Transaction incompleted: remaining quantity is lower than your request of selling ${quantity}`)

        buyInQuantity -= quantity

        buyInTransaction.quantity = buyInQuantity

        const {price} = stockSelected

        if (!price) throw new ConflictError(`price is not defined in this stock`)
        
        const amount = quantity * price

        let {budget}  = user

        budget += amount 

        buyInTransaction.amount -= amount
        
        user.budget = budget
        
        // let time = moment(new Date).format('DD/MM/YY hh:mm')

        let time = new Date

        const sellOutTransaction = await Sellout.create({company: companyId, stock: stockId, buyInTransaction: buyInTransactionId, operation, quantity, amount: amount, time: time})

        const relatedTo = buyInTransaction.relatedTo

        relatedTo.push(sellOutTransaction.id)

        buyInTransaction.save()
        user.transactions[0] = buyInTransaction
        user.save()

        return sellOutTransaction
    })()
}