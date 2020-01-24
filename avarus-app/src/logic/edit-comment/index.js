import call from '../../utils/call'
const { validate, errors: { CredentialsError, NotFoundError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * edit-comment
 * 
 * @param {token} string
 * @param {commentId} string
 * @param {newBody} string
 * 
 */


export default  function (token, commentId, newBody) {

    validate.string(token)
    validate.string.notVoid('token', token)

    validate.string(commentId)
    validate.string.notVoid('commentId', commentId)

    if(newBody){

        validate.string(newBody)
        validate.string.notVoid('newBody', newBody)

    }

    return (async () => {
        debugger
        const res = await call(`${API_URL}/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({newBody })
        })

        if (res.status === 200)  return
        
        if (res.status === 400) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}