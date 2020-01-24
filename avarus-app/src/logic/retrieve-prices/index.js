import call from '../../utils/call'
const { validate, errors: { NotFoundError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

/**
 *
 * retrieve sell-out transaction
 * 
 * @param {id} ObjectId
 * 
 * @returns {Array} 
 * 
 */

export default function (id) {

    validate.string(id)
    validate.string.notVoid('id', id)

    return (async () => { 

        const res = await call(`${API_URL}/companies/${id}/avgprice`, {
            method: 'GET'
        })
        
        if (res.status === 200) { 
            return JSON.parse(res.body)
        
        }

        if (res.status === 404) throw new NotFoundError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}