require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveBuyin = require('.')
const { errors: { NotFoundError, ContentError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve transaction of buy-in', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, quantity

    let email, username, password, verifiedPassword, budget

    let companyname, description, risk, market, category, dependency, stocks, image 

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
            
            await user.save()
  
            userId = user.id
  
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

            id = buyin.id
            
            await buyin.save()

        })

        it('should succeed on correct user id', async () => { 

            const buyinTransaction = await retrieveBuyin(id)

            expect(buyinTransaction).to.exist

            expect(buyinTransaction.transactionId).to.be.a("string")
            expect(buyinTransaction.operation).to.be.a('string')
            expect(buyinTransaction.company).to.be.a("object")
            expect(buyinTransaction.stockSelected).to.be.a('object')
            expect(buyinTransaction.user).to.be.a('object')
            expect(buyinTransaction.amount).to.be.a('number')     
            expect(buyinTransaction.quantity).to.be.a('number')
            expect(buyinTransaction.time).to.be.a('date')
            expect(buyinTransaction.relatedTo).to.be.a('array')

        })


        it('should fail on wrong user id', async () => {

            
            let id = '5de408747f38731d659c75e9'

            try {
                await retrieveBuyin(id)

                throw Error('should not reach this point')

            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal(`we can't found this buy-in with id ${id}`)
            }
        })

        it('should fail on incorrect type and content', () => {
            expect(() => retrieveBuyin(1)).to.throw(TypeError, '1 is not a string')
            expect(() => retrieveBuyin(true)).to.throw(TypeError, 'true is not a string')
            expect(() => retrieveBuyin([])).to.throw(TypeError, ' is not a string')
            expect(() => retrieveBuyin({})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => retrieveBuyin(undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => retrieveBuyin(null)).to.throw(TypeError, 'null is not a string')

            expect(() => retrieveBuyin('')).to.throw(ContentError, 'id is empty or blank')
            expect(() => retrieveBuyin(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        })

        after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])
        
    .then(database.disconnect))
})