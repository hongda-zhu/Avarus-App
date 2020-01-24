require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {createComment} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, database, models: { User, Company, Stock, Transaction, Comment } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

describe('logic - create comment', () => {

    beforeAll(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, buyInTransactionId, quantity, token
    
    let email, username, password, verifiedPassword, budget
    let companyname, description, risk, market, category, dependency, stocks, image, transactions, price, stockTime, amount, transactionTime

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

        })
    
        it('should create successfully a comment with correct information', async () => {

            const result = await createComment(token, buyInTransactionId, body)

            expect(result).toBeUndefined() 

            const comment = await Comment.find()
            const [newComment] = comment
            
            expect(newComment).toBeDefined()

            expect(typeof newComment.user).toEqual('object')
            expect(newComment.user.toString()).toEqual(userId)
            expect(typeof newComment.transaction).toEqual('object')
            expect(newComment.transaction.toString()).toEqual(buyInTransactionId)

            expect(typeof newComment.body).toEqual('string')
            expect(newComment.body).toEqual(body)
            expect(newComment.date).toBeInstanceOf(Date)

        })

        it('should failed to create a new comment with wrong user id', async () => {

            const wrongUserId = ObjectId().toString()
            const wrongToken = jwt.sign({sub: wrongUserId}, TEST_SECRET)

            try {
                await createComment(wrongToken, buyInTransactionId, body)

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
                await createComment(token, wrongBuyInTransactionId, body)

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

    it('should fail on incorrect userId, companyId, transactionId, body or expression type and content', () => {

        
        expect(() => createComment(1)).toThrow(TypeError, '1 is not a string')
        expect(() => createComment(true)).toThrow(TypeError, 'true is not a string')
        expect(() => createComment([])).toThrow(TypeError, ' is not a string')
        expect(() => createComment({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createComment(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createComment(null)).toThrow(TypeError, 'null is not a string')
        expect(() => createComment('')).toThrow(ContentError, 'userId is empty or blank')
        expect(() => createComment(' \t\r')).toThrow(ContentError, 'userId is empty or blank')

        expect(() => createComment(userId, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => createComment(userId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => createComment(userId, [])).toThrow(TypeError, ' is not a string')
        expect(() => createComment(userId, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createComment(userId, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createComment(userId, null)).toThrow(TypeError, 'null is not a string')
        expect(() => createComment(userId, '')).toThrow(ContentError, 'transactionId is empty or blank')
        expect(() => createComment(userId, ' \t\r')).toThrow(ContentError, 'transactionId is empty or blank')
    
        expect(() => createComment(userId, buyInTransactionId, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => createComment(userId, buyInTransactionId, true)).toThrow(TypeError, 'true is not a string')
        expect(() => createComment(userId, buyInTransactionId, [])).toThrow(TypeError, ' is not a string')
        expect(() => createComment(userId, buyInTransactionId, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => createComment(userId, buyInTransactionId, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => createComment(userId, buyInTransactionId, null)).toThrow(TypeError, 'null is not a string')
        expect(() => createComment(userId, buyInTransactionId, '')).toThrow(ContentError, 'body is empty or blank')
        expect(() => createComment(userId, buyInTransactionId, ' \t\r')).toThrow(ContentError, 'body is empty or blank')

    })

        afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Comment.deleteMany()])
        .then(database.disconnect))
})