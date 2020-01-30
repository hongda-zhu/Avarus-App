require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const buyInStock = require('.')
const { random, floor } = Math
const { errors: { NotFoundError, ConflictError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - buy-in', () => {
    before(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let userId, companyId, stockId, operation, quantity

    let username, email, password, verifiedPassword, budget 

    let companyname, description, risk, market, category, dependency, stocks, image 

    let price, stockTime
    
    
        beforeEach(async () => {

          await Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])

          email = `email-${random()}@mail.com`
          username = `username-${random()}`
          password = verifiedPassword = `password-${random()}`
          budget = 5000
  
          const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget})
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

        })
        

      it('should process correctly the buy-in transaction when all the inputs are in correct form', async () => { 

        

        const buyInTransaction = await buyInStock(userId, companyId, stockId, operation, quantity) 

        expect(buyInTransaction).to.exist
        expect(buyInTransaction.id).to.be.a('string')
        expect(buyInTransaction.company).to.be.a('object')
        expect(buyInTransaction.stock).to.be.a('object')
        expect(buyInTransaction.user).to.be.a('object')
        expect(buyInTransaction.operation).to.be.a('string')
        expect(buyInTransaction.quantity).to.be.a('number')
        expect(buyInTransaction.amount).to.be.a('number')

      })

      it('should not create a new transaction if operation is not buy-in', async () => {

        let wrongOperation = 'sell-out'

        try {

          await buyInStock(userId, companyId, stockId, wrongOperation, quantity)

          throw Error('should not reach this point')

          } catch (error) {
              expect(error).to.exist
              expect(error).to.be.an.instanceOf(ConflictError)
              expect(error.message).to.equal(`it should be buy-in operation`)
          }

      })

      it('should not create a new transaction if user`s id is wrong', async () => {

        let userID = "5de407687f38731d659c98e5"

        try {

          await buyInStock(userID, companyId, stockId, operation, quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userID} does not exists`)
        }

      })


      it('should not create a new transaction if Company`s id is wrong', async () => {

        let CompanyID = "5de407687f38731d659c98e5"

        try {

          await buyInStock(userId, CompanyID, stockId, operation, quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`company with id ${CompanyID} does not exists`)
        }

      })

      it('should not create a new transaction if stock`s id is wrong', async () => {

        let StockID = "5de407687f38731d659c98e5"

        try {

          await buyInStock(userId, companyId, StockID, operation, quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`stock with id ${StockID} does not exists`)
        }

      })

      it('should not create a new transaction if quantity is exceeded', async () => {

        let Quantity = 10000

        try {

          await buyInStock(userId, companyId, stockId, operation, Quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            expect(error.message).to.equal(`you have no enough resource to finish this transaction`)
        }

      })

    after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])
    .then(database.disconnect))
})