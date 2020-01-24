require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET} } = process
const {deleteComment} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, ContentError} } = require('avarus-util')
const { ObjectId, database, models: { User, Company, Stock, Transaction, Comment } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

describe('logic - delete comment', () => {

    beforeAll(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, commentId, operation, buyInTransactionId, quantity, token

    let email, username, password, verifiedPassword, budget
    let companyname, description, risk, market, category, dependency, stocks, image, transactions, transactionTime, price, stockTime, amount

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

            const comment = await Comment.create({user: userId, transaction: buyInTransactionId, body, date: new Date}) 

            commentId = comment.id

            await comment.save()

        })
    
        it('should create successfully a comment with correct information', async () => {
            
            await deleteComment(token, commentId)

            const deleteCommentObject = await Comment.findById(commentId)
            
            expect(deleteCommentObject).toBe(null)

        })

        it('should failed with wrong comment id', async () => {

            const wrongCommentId = ObjectId().toString()

            try {
                await deleteComment(token, wrongCommentId)

                throw Error(`should not reach this point`)

            } catch(error){
                
                expect(error).toBeDefined()
                expect(error.message).toBeDefined()
                expect(typeof error.message).toEqual('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toEqual(`comment with id ${wrongCommentId} does not exists`)
                expect(error).toBeInstanceOf(NotFoundError)

            }
        
        })

        
    it('should fail on incorrect userId, companyId, transactionId or expression type and content', () => {

        expect(() => deleteComment(1)).toThrow(TypeError, '1 is not a string')
        expect(() => deleteComment(true)).toThrow(TypeError, 'true is not a string')
        expect(() => deleteComment([])).toThrow(TypeError, ' is not a string')
        expect(() => deleteComment({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => deleteComment(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => deleteComment(null)).toThrow(TypeError, 'null is not a string')
        expect(() => deleteComment('')).toThrow(ContentError, 'commentId is empty or blank')
        expect(() => deleteComment(' \t\r')).toThrow(ContentError, 'commentId is empty or blank')

    })

        afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Comment.deleteMany()])
        .then(database.disconnect))
})