import call from '../../utils/call'
const { validate, errors: { CredentialsError, NotFoundError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * edit-user
 * 
 * @param {token} string
 * @param {email} string
 * @param {password} string
 * @param {verifiedPassword} string
 * 
 */


export default  function (token, email, password, verifiedPassword) {

    validate.string(token)
    validate.string.notVoid('token', token)

    if(email){

        validate.string(email)
        validate.string.notVoid('email', email)
        validate.email(email)

    }

    if(password) {

        validate.string(password)
        validate.string.notVoid('password', password)

    }

    if(verifiedPassword) {

        validate.string(verifiedPassword)
        validate.string.notVoid('verifiedPassword', verifiedPassword)

    }

    return (async () => {
        debugger
        const res = await call(`${API_URL}/users`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ email, password, verifiedPassword })
        })

        if (res.status === 200)  return
          
        if (res.status === 400) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}