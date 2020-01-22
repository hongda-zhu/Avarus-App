import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * create-comment
 * 
 * @param {token} string
 * @param {transactionId} ObjectId
 * @param {body} string
 * 
 */


export default function (token, transactionId, body) {
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(transactionId)
    validate.string.notVoid('transactionId', transactionId)

    validate.string(body)
    validate.string.notVoid('body', body)


    return (async () => {

        const res = await call(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ transactionId, body })
        })
        if (res.status === 201) return

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}