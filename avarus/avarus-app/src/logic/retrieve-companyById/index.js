import call from '../../utils/call'
const { validate, errors: { CredentialsError, NotFoundError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * retrieve sell-out transaction
 * 
 * @param {companyId} ObjectId enum
 * 
 * @returns {Array} 
 * 
 */

export default function (companyId, token) {

    validate.string(companyId)
    validate.string.notVoid('companyId', companyId)

    validate.string(token)
    validate.string.notVoid('token', token)

    return (async () => { 
        const res = await call(`${API_URL}/companies/company/${companyId}`, 
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }

        })

        if (res.status === 200) {
            const company = JSON.parse(res.body)

            return company
        }

        if (res.status === 401) throw new CredentialsError(JSON.parse(res.body).message)
        
        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()
}