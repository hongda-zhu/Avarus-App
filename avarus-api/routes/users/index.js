const { Router } = require('express')
const { registerUser, authenticateUser, retrieveUser, retrieveBuyin, retrieveSellout, deleteUser, deleteStock, deleteBuyin, deleteSellout, editUser, buyIn, sellOut, toggleFav, saveUserPicture, loadUserPicture } = require('../../logic')
const jwt = require('jsonwebtoken')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('../../../avarus-util')
const Busboy = require('busboy')
const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/', jsonBodyParser, (req, res) => {
    const { body: {email, username, password, veryfiedPassword, budget = 5000} } = req

    try {
        registerUser(email, username, password, veryfiedPassword, budget)
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

router.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { username, password } } = req

    try {
        authenticateUser(username, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '1d' })
                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/', tokenVerifier, (req, res) => {
    
    const { id } = req
    try {

        retrieveUser(id)
            .then(user => res.json({ user }))
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



router.patch('/', jsonBodyParser, tokenVerifier, (req, res) => {

    const {id , body: { email, password, verifiedPassword} } = req
    
    try {
        editUser(id, email, password, verifiedPassword)
            .then(() => res.status(200).end())
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.delete('/:id', tokenVerifier, (req, res) => {

    const { params: { id } } = req
    try {
        deleteUser(id)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.delete('/transaction/:transactionId', tokenVerifier, (req, res) => {

    const { id, params: { transactionId } } = req

    try {
        deleteStock(id, transactionId)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:id/buyin', jsonBodyParser, (req, res) => {
    
    const { params: { id: userId } , body: {companyId, stockId, operation, quantity } } = req

    try {
        
        buyIn(userId, companyId, stockId, operation, quantity)
        // .then(() => res.status(201).end())
        .then(transaction => res.json({ transaction }))
            .catch(error => { 
                const { message } = error

                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/:id/sellout', jsonBodyParser, (req, res) => {
    
    const { params: { id: userId } , body: {companyId, stockId, buyInTransactionId, operation, quantity } } = req

    try {
        sellOut(userId, companyId, stockId, buyInTransactionId, operation, quantity)
        .then(() => res.status(201).end())
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json({ message })
                
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })

                if (error instanceof ConflictError)
                    return res.status(409).json({ message })

                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.get('/buyin/:id', (req, res) => {

    const { params: { id } } = req

    try {

        retrieveBuyin(id)
            .then(buyin => res.json(buyin ))
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

router.get('/sellout/:id', (req, res) => {

    const { params: { id } } = req

    try {

        retrieveSellout(id)
            .then(sellouts => res.json(sellouts ))
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

router.delete('/buyin/:id', (req, res) => {
    
            const { params: { id } } = req
    
    try {

        deleteBuyin(id)
            .then(res.end())
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

router.delete('/sellout/:id', (req, res) => {

    const { params: { id } } = req

    try {
        deleteSellout(id)
            .then(res.end())
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

router.patch('/favs/:companyId', jsonBodyParser, tokenVerifier, (req, res) => {
    const {id:userId,  params:{companyId} } = req

    
    
    try {
        toggleFav(userId, companyId)
            .then(() =>
                res.end()
            )
            .catch(error => {
                const { message } = error
                if (error instanceof NotFoundError)
                    return res.status(404).json({ message })
                if (error instanceof ConflictError)
                    return res.status(409).json({ message })
                res.status(500).json({ message })
            })
    } catch ({ message }) {
        res.status(400).json({ message })
    }
})

router.post('/profile', tokenVerifier, (req, res) => {
    
    const {  id  } = req
    const busboy = new Busboy({ headers: req.headers })
    busboy.on('file', async(fieldname, file, filename, encoding, mimetype) => {
        filename = 'profile.png'
        await saveUserPicture(id, file, filename)
    })
    busboy.on('finish', () => {
        res.end("That's all folks!")
    })
    return req.pipe(busboy)
})

router.get('/load/:userId', async (req, res) => {

    const { params: { userId } } = req

    const stream = await loadUserPicture(userId) 

    res.setHeader('Content-Type', 'image/jpeg')

    return stream.pipe(res)
})

module.exports = router