import call from '../../utils/call'
const { validate, errors: { CredentialsError, NotFoundError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * retrieve-comments
 * 
 * @param {token} string
 * @param {transactionId} ObjectId
 * 
 * @returns {Array} 
 * 
 */

export default  function (token, transactionId) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(transactionId)
    validate.string.notVoid('transactionId', transactionId)

    return (async () => {  
        debugger
        const res = await call(`${API_URL}/comments/${transactionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ transactionId })
        })

        if (res.status === 200) {

            const comments = JSON.parse(res.body)
            
            return comments
        }

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}