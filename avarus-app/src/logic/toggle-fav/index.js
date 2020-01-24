import call from '../../utils/call'
const { validate, errors: { ConflictError} } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
* Toggle Favorite
* 
* @param {string} idUser
* 
* @throws {ConflictError} If exist another user with the same username.
* 
* @return {status}  status 201
*/

export default function (token, companyId) {
    validate.string(token)
    validate.string.notVoid('token', token)
    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)
    

    return (async () => {

        
        const res = await call(`${API_URL}/users/favs/${companyId}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        if (res.status === 200) return 
        
        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}