import call from '../../utils/call'
const { validate, errors: { ConflictError, NotFoundError, CredentialsError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL


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

export default function (userId, companyId, stockId, operation, quantity) {

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

        const res = await call(`${API_URL}/users/${userId}/buyin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({companyId, stockId, operation, quantity})
        })
        if (res.status === 200) { 
            let transaction = JSON.parse(res.body)
            return transaction
        }

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}