require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {retrieveComments} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, ContentError} } = require('avarus-util')
const { ObjectId, database, models: { User, Company, Stock, Transaction, Comment } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

describe('logic - retrieve comments', () => {

    beforeAll(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, buyInTransactionId, quantity, token, transactions, transactions1, price, stockTime, amount, transactionTime

    let userId1, email1, username1, password1, verifiedPassword1, budget1

    let email, username, password, verifiedPassword, budget
    let companyname, description, risk, market, category, dependency, stocks, image 

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']
    let body = 'this is a comment'
    
    
        beforeEach(async () => {

            await Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])

            email = `email-${random()}@mail.com`
            username = `username-${random()}`
            password = verifiedPassword = `password-${random()}`
            budget = 5000
            transactions = []

            const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})

            userId = user.id
            token = jwt.sign({sub: userId}, TEST_SECRET)
            await user.save()

            email1 = `email1-${random()}@mail.com`
            username1 = `username1-${random()}`
            password1 = verifiedPassword1 = `password1-${random()}`
            budget1 = 5000
            transactions1 = []

            const user1 = await User.create({  email1, username1, password1: await bcrypt.hash(password1, 10), verifiedPassword1, budget1, transactions1})

            userId1 = user1.id
            await user1.save()

            companyname = `name-${random()}`
            description = `description-${random()}`
            risk = risks[floor(random() * risks.length)]
            market = markets[floor(random() * markets.length)]
            category = categories[floor(random() * categories.length)]        
            dependency = [`dependency ${random()}`]
            image = `image ${random()}`
            stocks = []
            const company = await Company.create({name: companyname, description, risk, market, category, dependency, image, stocks})
            companyId = company.id
            price = floor(random() *10)
            stockTime = new Date
            const stock = await Stock.create({price: price, time:stockTime})
            
            stockId = stock.id
            company.stocks.push(stock)
            await company.save()
            operation = 'buy-in'
            quantity = floor(random()*10) + 6
            amount = price * quantity
            transactionTime = new Date
        
            const transaction = await Transaction.create({company: companyId, stock:stockId, user:userId, operation, quantity, amount, time:transactionTime})

            buyInTransactionId = transaction.id

            await transaction.save()

            const comment = await Comment.create({user: userId, transaction: buyInTransactionId, body, date: new Date}) 
            await comment.save()

            const comment1 = await Comment.create({user: userId, transaction: buyInTransactionId, body, date: new Date}) 

            await comment1.save()

            const comment2 = await Comment.create({user: userId1, transaction: buyInTransactionId, body, date: new Date}) 

            await comment2.save()

        })
    
        it('should create successfully a comment with correct information', async () => {
            
            const newComments = await retrieveComments(token, buyInTransactionId)
            
            expect(newComments).toBeDefined()
            expect(typeof newComments).toBe('object')

            newComments.forEach(newComment => {

                
                expect(typeof newComment.user).toBe('string')
                expect(newComment.user.toString()).toEqual(userId)
                expect(typeof newComment.transaction).toBe('string')
                expect(newComment.transaction.toString()).toEqual(buyInTransactionId)
                expect(typeof newComment.body).toBe('string')
                expect(newComment.body).toEqual(body)
                expect(typeof newComment.date).toBe('string')

            })


        })

        it('should failed to create a new comment with wrong user id', async () => {

            const wrongUserId = ObjectId().toString()
            const wrongToken = jwt.sign({sub: wrongUserId}, TEST_SECRET)

            try {
                await retrieveComments(wrongToken, buyInTransactionId)

                throw Error(`should not reach this point`)

            } catch(error){
                expect(error).toBeDefined()
                expect(error.message).toBeDefined()
                expect(typeof error.message).toEqual('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toEqual(`user with id ${wrongUserId} does not exists`)
                expect(error).toBeInstanceOf(NotFoundError)

            }
        
        })

        it('should failed to create a new comment with wrong user id', async () => {

            const wrongUserId = ObjectId().toString()
            const wrongToken = jwt.sign({sub: wrongUserId}, TEST_SECRET)

            try {
                await retrieveComments(wrongToken, buyInTransactionId)

                throw Error(`should not reach this point`)

            } catch(error){
                expect(error).toBeDefined()
                expect(error.message).toBeDefined()
                expect(typeof error.message).toEqual('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toEqual(`user with id ${wrongUserId} does not exists`)
                expect(error).toBeInstanceOf(NotFoundError)

            }
        
        })


        it('should failed to create a new comment with wrong transaction id', async () => {

            const wrongBuyInTransactionId = ObjectId().toString()

            try {
                await retrieveComments(token, wrongBuyInTransactionId)

                throw Error(`should not reach this point`)

            } catch(error){
                expect(error).toBeDefined()
                expect(error.message).toBeDefined()
                expect(typeof error.message).toEqual('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toEqual(`transaction with id ${wrongBuyInTransactionId} does not exists`)
                expect(error).toBeInstanceOf(NotFoundError)

            }
        
        })

        
    it('should fail on incorrect userId, companyId, transactionId or expression type and content', () => {
        
        expect(() => retrieveComments(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveComments(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveComments([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveComments({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveComments(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveComments(null)).toThrow(TypeError, 'null is not a string')
        expect(() => retrieveComments('')).toThrow(ContentError, 'userId is empty or blank')
        expect(() => retrieveComments(' \t\r')).toThrow(ContentError, 'userId is empty or blank')

        expect(() => retrieveComments(userId, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveComments(userId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveComments(userId, [])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveComments(userId, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveComments(userId, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveComments(userId, null)).toThrow(TypeError, 'null is not a string')
        expect(() => retrieveComments(userId, '')).toThrow(ContentError, 'transactionId is empty or blank')
        expect(() => retrieveComments(userId, ' \t\r')).toThrow(ContentError, 'transactionId is empty or blank')

    })

        afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Comment.deleteMany()])
        .then(database.disconnect))
})