import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

export default function (userId, companyId, stockId, buyInTransactionId, operation, quantity) { 

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

        

        const res = await call(`${API_URL}/users/${userId}/sellout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({companyId, stockId, buyInTransactionId, operation, quantity})
        })
        if (res.status === 201) return 

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}