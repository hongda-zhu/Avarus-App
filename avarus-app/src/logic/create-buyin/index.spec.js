require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {buyIn} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, ConflictError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction } } = require('avarus-data')
const bcrypt = require('bcryptjs')

fdescribe('logic - buy-in', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

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

        const buyInTransaction = await buyIn(userId, companyId, stockId, operation, quantity) 

        expect(typeof buyInTransaction.transaction._id).toBeDefined()
        expect(typeof buyInTransaction.transaction.company).toBeDefined()
        expect(typeof buyInTransaction.transaction.stock).toBeDefined()
        expect(typeof buyInTransaction.transaction.user).toBeDefined()
        expect(typeof buyInTransaction.transaction.operation).toBeDefined()
        expect(typeof buyInTransaction.transaction.amount).toBeDefined()

        expect(typeof buyInTransaction.transaction._id).toEqual('string')
        expect(typeof buyInTransaction.transaction.company).toEqual('string')
        expect(typeof buyInTransaction.transaction.stock).toEqual('string')
        expect(typeof buyInTransaction.transaction.user).toEqual('string')
        expect(typeof buyInTransaction.transaction.operation).toEqual('string')
        expect(typeof buyInTransaction.transaction.quantity).toEqual('number')
        expect(typeof buyInTransaction.transaction.amount).toEqual('number')

        expect(buyInTransaction.transaction.user).toBe(userId)
        expect(buyInTransaction.transaction.company).toBe(companyId)
        expect(buyInTransaction.transaction.stock).toBe(stockId)
        expect(buyInTransaction.transaction.operation).toBe(operation)
      })

      it('should not create a new transaction if operation is not buy-in', async () => {

        let wrongOperation = 'sell-out'

        try {

          await buyIn(userId, companyId, stockId, wrongOperation, quantity)

          throw Error('should not reach this point')

          } catch (error) {
  
              expect(error).toBeDefined()
              expect(error).toBeInstanceOf(ConflictError)
              expect(error.message).toBeDefined()
              expect(error.message.length).toBeGreaterThan(0)
              expect(typeof error.message).toEqual('string')
              expect(error.message).toEqual(`it should be buy-in operation`)
          }

      })

      it('should not create a new transaction if user`s id is wrong', async () => {

        let userID = "5de407687f38731d659c98e5"

        try {

          await buyIn(userID, companyId, stockId, operation, quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(error.message.length).toBeGreaterThan(0)
            expect(typeof error.message).toEqual('string')
            expect(error.message).toEqual(`user with id ${userID} does not exists`)
        }

      })


      it('should not create a new transaction if Company`s id is wrong', async () => {

        let CompanyID = "5de407687f38731d659c98e5"

        try {

          await buyIn(userId, CompanyID, stockId, operation, quantity)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(error.message.length).toBeGreaterThan(0)
            expect(typeof error.message).toEqual('string')
            expect(error.message).toEqual(`company with id ${CompanyID} does not exists`)

        }

      })

      it('should not create a new transaction if stock`s id is wrong', async () => {

        let StockID = "5de407687f38731d659c98e5"

        try {

          await buyIn(userId, companyId, StockID, operation, quantity)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(error.message.length).toBeGreaterThan(0)
            expect(typeof error.message).toEqual('string')
            expect(error.message).toEqual(`stock with id ${StockID} does not exists`)

        }

      })

      it('should not create a new transaction if quantity is exceeded', async () => {

        let Quantity = 10000

        try {

          await buyIn(userId, companyId, stockId, operation, Quantity)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ConflictError)
            expect(error.message).toBeDefined()
            expect(error.message.length).toBeGreaterThan(0)
            expect(typeof error.message).toEqual('string')
            expect(error.message).toEqual(`you have no enough resource to finish this transaction`)
        }

      })

    afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])
    .then(database.disconnect))
})