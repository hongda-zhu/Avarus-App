const { Router } = require('express')
const { createComment, retrieveComments, editComment ,deleteComment} = require('../../logic')
const { env: { SECRET } } = process
const tokenVerifier = require('../../helpers/token-verifier')(SECRET)
const bodyParser = require('body-parser')
const { errors: { NotFoundError, ConflictError } } = require('avarus-util')

const jsonBodyParser = bodyParser.json()

const router = Router()

router.post('/', jsonBodyParser, tokenVerifier, (req, res) => { 
    
    const { id: userId, body: {transactionId, body} } = req
    
    try {
        createComment(userId, transactionId, body)
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


router.get('/:transactionId', jsonBodyParser, tokenVerifier, (req, res) => {
    debugger
    const {id:userId, params:{transactionId} } = req

    try { 

        retrieveComments(userId, transactionId)
            .then(comments => res.json( comments ))
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

router.patch('/:commentId', tokenVerifier, jsonBodyParser, (req, res) => {
    debugger
    const {params:{commentId}, body: {newBody}} = req

    try {

        editComment(commentId, newBody)
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


router.delete('/:commentId', tokenVerifier, (req,res)=>{
    const { params:{commentId} } = req

    try {
        deleteComment(commentId)
        .then(() => res.status(204).end())
        .catch(error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            if(error instanceof ConflictError) return res.status(409).json(error.message)
            res.status(500).end()
        })
    }  catch (error) {
        const { message } = error

        res.status(400).json({ message })
    }
})

module.exports = router