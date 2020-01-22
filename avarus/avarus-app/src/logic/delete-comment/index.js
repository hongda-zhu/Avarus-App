import call from '../../utils/call'
const { validate, errors: { ConflictError, NotFoundError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * delete-comment
 * 
 * @param {token} string
 * @param {transactionId} ObjectId
 * 
 * @returns {Array} 
 * 
 */

export default  function (token, commentId) { 
    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(commentId)
    validate.string.notVoid('commentId', commentId)

    return (async () => {  

        const res = await call(`${API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (res.status === 204) return

        if (res.status === 404) throw new ConflictError(JSON.parse(res.body).message)
        
        if (res.status === 409) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}