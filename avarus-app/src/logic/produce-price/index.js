import call from '../../utils/call'
const { validate, errors: { ConflictError } } = require('avarus-util')
const API_URL = process.env.REACT_APP_API_URL

export default function () {

    return (async () => { 

        const res = await call(`${API_URL}/companies/price`, {
            method: 'POST'
        })
        if (res.status === 200) return

        if (res.status === 409) throw new ConflictError(JSON.parse(res.body).message)

        throw new Error(JSON.parse(res.body).message)
    })()

}