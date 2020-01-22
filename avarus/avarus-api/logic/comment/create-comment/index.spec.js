require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const createComment = require('.')
const { random, floor } = Math
const { errors: { NotFoundError, ConflictError, ContentError } } = require('avarus-util')
const { ObjectId, database, models: { User, Company, Stock, Transaction, Comment } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - create comment', () => {

    before(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, buyInTransactionId, quantity
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
            
            const newComment = await createComment(userId, buyInTransactionId, body)
            
            expect(newComment).to.exist
            expect(newComment).to.be.a('object')

            expect(newComment.user).to.be.a('object')
            expect(newComment.user.toString()).to.eql(userId)
            expect(newComment.transaction).to.be.a('object')
            expect(newComment.transaction.toString()).to.eql(buyInTransactionId)
            expect(newComment.body).to.be.a('string')
            expect(newComment.body).to.eql(body)
            expect(newComment.date).to.be.an.instanceOf(Date)

        })

        it('should failed to create a new comment with wrong user id', async () => {

            const wrongUserId = ObjectId().toString()

            try {
                await createComment(wrongUserId, buyInTransactionId, body)

                throw Error(`should not reach this point`)

            } catch(error){
                expect(error).to.exist
                expect(error.message).to.exist
                expect(typeof error.message).to.equal('string')
                expect(error.message.length).to.be.greaterThan(0)
                expect(error.message).to.equal(`user with id ${wrongUserId} does not exists`)
                expect(error).to.be.an.instanceOf(NotFoundError)

            }
        
        })


        it('should failed to create a new comment with wrong transaction id', async () => {

            const wrongBuyInTransactionId = ObjectId().toString()

            try {
                await createComment(userId, wrongBuyInTransactionId, body)

                throw Error(`should not reach this point`)

            } catch(error){
                expect(error).to.exist
                expect(error.message).to.exist
                expect(typeof error.message).to.equal('string')
                expect(error.message.length).to.be.greaterThan(0)
                expect(error.message).to.equal(`transaction with id ${wrongBuyInTransactionId} does not exists`)
                expect(error).to.be.an.instanceOf(NotFoundError)

            }
        
        })

    it('should fail on incorrect userId, companyId, transactionId, body or expression type and content', () => {

        
        expect(() => createComment(1)).to.throw(TypeError, '1 is not a string')
        expect(() => createComment(true)).to.throw(TypeError, 'true is not a string')
        expect(() => createComment([])).to.throw(TypeError, ' is not a string')
        expect(() => createComment({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createComment(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createComment(null)).to.throw(TypeError, 'null is not a string')
        expect(() => createComment('')).to.throw(ContentError, 'userId is empty or blank')
        expect(() => createComment(' \t\r')).to.throw(ContentError, 'userId is empty or blank')

        expect(() => createComment(userId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createComment(userId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createComment(userId, [])).to.throw(TypeError, ' is not a string')
        expect(() => createComment(userId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createComment(userId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createComment(userId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => createComment(userId, '')).to.throw(ContentError, 'transactionId is empty or blank')
        expect(() => createComment(userId, ' \t\r')).to.throw(ContentError, 'transactionId is empty or blank')
    
        expect(() => createComment(userId, buyInTransactionId, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => createComment(userId, buyInTransactionId, true)).to.throw(TypeError, 'true is not a string')
        expect(() => createComment(userId, buyInTransactionId, [])).to.throw(TypeError, ' is not a string')
        expect(() => createComment(userId, buyInTransactionId, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => createComment(userId, buyInTransactionId, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => createComment(userId, buyInTransactionId, null)).to.throw(TypeError, 'null is not a string')
        expect(() => createComment(userId, buyInTransactionId, '')).to.throw(ContentError, 'body is empty or blank')
        expect(() => createComment(userId, buyInTransactionId, ' \t\r')).to.throw(ContentError, 'body is empty or blank')

    })

        after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Comment.deleteMany()])
        .then(database.disconnect))
})