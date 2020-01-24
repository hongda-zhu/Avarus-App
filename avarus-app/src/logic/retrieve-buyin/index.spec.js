require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const {retrieveBuyin} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, ContentError } } = require('avarus-util')
const { ObjectId, database, models: { User, Company, Stock, Transaction } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

describe('logic - retrieve transaction of buy-in', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, quantity, relatedTo

    let email, username, password, verifiedPassword, budget

    let companyname, description, risk, market, category, dependency, stocks, image, buyerId, amount, time, token

    let price, stockTime

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']
    
        beforeEach(async () => {
            await Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])

            email = `email-${random()}@mail.com`
            username = `username-${random()}`
            password = verifiedPassword = `password-${random()}`
            budget = 5000
    
            const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget})

              
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
            
            company.stocks.push(stock) 
            await company.save()
  
            stockId = stock.id
  
            operation = 'buy-in'
            quantity = floor(random()*10)
  
            operation = `buy-in`
            quantity = 10
            amount = 140
            time = new Date
            relatedTo = []

            const buyin = await Transaction.create({  user:userId, company:companyId, stock:stockId, operation, quantity, amount, time, relatedTo })

            buyerId = buyin.id
            
            await buyin.save()

        })

        it('should succeed on correct user id', async () => { 

            const buyinTransaction = await retrieveBuyin(buyerId)

            expect(buyinTransaction).toBeDefined()

            expect(typeof buyinTransaction.transactionId).toBe("string")
            expect(typeof buyinTransaction.operation).toBe('string')
            expect(typeof buyinTransaction.company).toBe("object")
            expect(typeof buyinTransaction.stockSelected).toBe('object')
            expect(typeof buyinTransaction.user).toBe('object')
            expect(typeof buyinTransaction.amount).toBe('number')     
            expect(typeof buyinTransaction.quantity).toBe('number')
            expect(typeof buyinTransaction.time).toBe('string')
            expect(typeof buyinTransaction.relatedTo).toBe('object')

        })


        it('should fail on wrong user id', async () => {

            const wrongUserId = ObjectId().toString()

            try {
                await retrieveBuyin(wrongUserId)

                throw Error('should not reach this point')

            } catch (error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(NotFoundError)
                expect(error.message).toEqual(`we can't found this buy-in with id ${wrongUserId}`)
            }
        })

        it('should fail on incorrect type and content', () => {
            expect(() => retrieveBuyin(1)).toThrow(TypeError, '1 is not a string')
            expect(() => retrieveBuyin(true)).toThrow(TypeError, 'true is not a string')
            expect(() => retrieveBuyin([])).toThrow(TypeError, ' is not a string')
            expect(() => retrieveBuyin({})).toThrow(TypeError, '[object Object] is not a string')
            expect(() => retrieveBuyin(undefined)).toThrow(TypeError, 'undefined is not a string')
            expect(() => retrieveBuyin(null)).toThrow(TypeError, 'null is not a string')

            expect(() => retrieveBuyin('')).toThrow(ContentError, 'id is empty or blank')
            expect(() => retrieveBuyin(' \t\r')).toThrow(ContentError, 'id is empty or blank')
        })

        afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleszteMany()])
        
    .then(database.disconnect))
})