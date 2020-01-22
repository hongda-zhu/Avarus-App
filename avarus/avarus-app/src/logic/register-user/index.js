import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * create-buyIn-transaction
 * 
 * @param {name} string
 * @param {surname} string
 * @param {email} string
 * @param {username} string 
 * @param {password} string
 * @param {budget} number
 * 
 */


export default function (email, username, password, veryfiedPassword, budget) {
    validate.string(email)
    validate.string.notVoid('email', email)
    validate.email(email)
    
    validate.string(username)
    validate.string.notVoid('username', username)

    validate.string(password)
    validate.string.notVoid('password', password)

    validate.string(veryfiedPassword)
    validate.string.notVoid('veryfiedPassword', veryfiedPassword)

    validate.number(budget)

    return (async () => {

        const res = await call(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, veryfiedPassword, budget })
        })
        if (res.status === 201) return 

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}