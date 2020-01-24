require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveSellout = require('.')
const { errors: { NotFoundError, ContentError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction, Sellout } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve sell-out', () => {
    before(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, quantity, id

    let email, username, password, verifiedPassword, budget

    let companyname, description, risk, market, category, dependency, stocks, image 

    let price, stockTime

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']
    
    
        beforeEach(async () => {

          await Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])

          email = `email-${random()}@mail.com`
          username = `username-${random()}`
          password = verifiedPassword = `password-${random()}`
          budget = 5000
          transactions = []
    
          const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})
          
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
          
          stockId = stock.id
          company.stocks.push(stock)
          await company.save()

          operation = 'buy-in'
          quantity = floor(random()*10) + 6
          amount = price * quantity
          transactionTime = new Date
        
          const transaction = await Transaction.create({company: companyId, stock:stockId, user:userId, operation, quantity, amount, time:transactionTime})

          buyInTransactionId = transaction.id

          operation2 = 'sell-out'

          quantity2 =  floor(random()*5) + 1

          amount2 = 140

          time2 = new Date

          const sellOut = await Sellout.create({company:company, stock:stockId, buyInTransaction:buyInTransactionId,operation:operation2, quantity:quantity2, amount:amount2, time:time2})

          id = sellOut.id

          transaction.relatedTo.push(sellOut)

          await transaction.save()

          await sellOut.save()

        })

        it('should succeed on correct user id', async () => {

            const sellout = await retrieveSellout(id)

            expect(sellout).to.exist
            expect(sellout.selloutId).to.be.a("string")
            expect(sellout.operation).to.be.a('string')
            expect(sellout.company).to.be.a("object")
            expect(sellout.stockSelected).to.be.a('object')
            expect(sellout.buyInTransaction).to.be.a('object')
            expect(sellout.amount).to.be.a('number')     
            expect(sellout.quantity).to.be.a('number')
            expect(sellout.time).to.be.a('date')

        })


        it('should fail on wrong user id', async () => {

            
            let iD = '5de408747f38731d659c21e1'

            try {
                await retrieveSellout(iD)

                throw Error('should not reach this point')

            } catch (error) {
                expect(error).to.exist
                
                expect(error).to.be.an.instanceOf(NotFoundError)
                expect(error.message).to.equal(`we can't found this sellout with id ${iD}`)
            }
        })

        it('should fail on incorrect type and content', () => {
            expect(() => retrieveSellout(1)).to.throw(TypeError, '1 is not a string')
            expect(() => retrieveSellout(true)).to.throw(TypeError, 'true is not a string')
            expect(() => retrieveSellout([])).to.throw(TypeError, ' is not a string')
            expect(() => retrieveSellout({})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => retrieveSellout(undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => retrieveSellout(null)).to.throw(TypeError, 'null is not a string')

            expect(() => retrieveSellout('')).to.throw(ContentError, 'id is empty or blank')
            expect(() => retrieveSellout(' \t\r')).to.throw(ContentError, 'id is empty or blank')
        })

        after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])
        .then(database.disconnect))
})