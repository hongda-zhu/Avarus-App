const { Router } = require('express')
const { createCompany, retrieveCompanies, retrieveCompany, editCompany, createPrice, producePrice,retrievePrices, retrievePrice} = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('avarus-util')

const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/', jsonBodyParser, (req, res) => { 
    
    const { body: { name, description, risk, market, category, dependency, image, stocks } } = req

    try {
        createCompany(name, description, risk, market, category, dependency, image, stocks)
            .then(() => res.status(201).end())
            .catch(error => {
                const { message } = error

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


router.get('/:query', tokenVerifier, jsonBodyParser, (req, res) => {

    const {id:userId, params:{query}} = req

    let value = query

    if(query == "undefined") value = false

    try { 

        retrieveCompanies(value, userId)

            .then(companies => res.json( companies ))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.get('/company/:companyId', jsonBodyParser, tokenVerifier, (req, res) => {

    
    const { id:userId, params: {companyId} } = req
    
    try {
        retrieveCompany(companyId, userId)
            .then(company => res.json(company))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

router.patch('/:id', tokenVerifier, jsonBodyParser, (req, res) => {

    const { params: { id }, body: { company: { name, description, risk, market, category, dependency, image, stocks}}} = req

    try {

        editCompany(id, name, description, risk, market, category, dependency, image, stocks)
            .then(() => res.status(200).end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:id/price', jsonBodyParser, (req, res) => {

    const { params: { id }, body: { price }} = req

    try { 
        createPrice(id, price)
            .then(() => res.status(200).end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/price', (req, res) => {

    try { 

        producePrice()
            // .then(arr => res.json(arr))
            .then(() => res.status(200).end())
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


router.get('/:id/avgprice', (req, res) => {

    const { params: { id }} = req

    try { 

        retrievePrices(id)
            
            .then(arrPrices => res.json(arrPrices))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {

        res.status(400).json({ message })

    }
})

router.get('/:id/price', tokenVerifier, jsonBodyParser, (req, res) => {

    const { params: { id }} = req
    try {
        retrievePrice(id)
            .then((stocks) => res.json({stocks}))
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})


module.exports = router