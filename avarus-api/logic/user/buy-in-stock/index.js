const { validate, errors: { ConflictError, NotFoundError } } = require('avarus-util')
const {models: { Company, User, Transaction } } = require('avarus-data')
const moment = require('moment')

/**
 *
 * create-buyIn-transaction
 * 
 * @param {userId} ObjectId
 * @param {companyId} ObjectId
 * @param {stockId} ObjectId
 * @param {operation} string enum
 * @param {quantity} number
 * 
 * @returns {Object} 
 * 
 */

module.exports = function (userId, companyId, stockId, operation, quantity) { 

    validate.string(userId)
    validate.string.notVoid('userId', userId)

    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)

    validate.string(stockId)
    validate.string.notVoid('stockId', stockId)

    validate.string(operation)
    validate.string.notVoid('operation', operation)
    validate.matches('operation', operation, 'buy-in', 'sell-out', 'preset')
    
    validate.number(quantity)

    return (async () => { 

        if (operation !== 'buy-in') throw new ConflictError(`it should be buy-in operation`)

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

        const {price} = stockSelected

        if (!price) throw new NotFoundError(`price is not defined in this stock`)
        
        const amount = quantity * price

        if(quantity === "" || quantity === 0 || !quantity)  throw new NotFoundError(`quantity is not defined for this transaction`)

        let {budget}  = user

        if(budget < amount) throw new ConflictError(`you have no enough resource to finish this transaction`)

        budget -= amount

        user.budget = budget

        // let time = moment(new Date).format('DD/MM/YY hh:mm')

        let time = new Date

        const transaction = await Transaction.create({company: companyId, stock: stockId, user: userId, operation, quantity, amount: amount, time: time})

        user.transactions.push(transaction)

        user.save()

        return transaction

    })()
}