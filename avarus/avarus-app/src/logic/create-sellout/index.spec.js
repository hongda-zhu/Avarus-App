require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL} } = process
const {sellOut: sellOutStock} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, ConflictError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction, Sellout } } = require('avarus-data')
const bcrypt = require('bcryptjs')


describe('logic - sell-out', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let userId, companyId, stockId, operation, quantity

    let email, username, password, verifiedPassword, budget

    let companyname, description, risk, market, category, dependency, stocks, image 

    let price, stockTime, buyInTransaction, transactions, amount, transactionTime, buyInTransactionId, operation2, quantity2

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']
    
    
        beforeEach(async () => {

          await Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])

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

        })
      

      it('should process correctly the sell-out transaction when all the inputs are in correct position', async () => {

        const newSellOutTransaction = await sellOutStock(userId, companyId, stockId, buyInTransactionId, operation2, quantity2)

        expect(newSellOutTransaction).toBeUndefined() 

        const [sellOutTransaction] = await Sellout.find()
        expect(sellOutTransaction.id).toBeDefined()
        expect(sellOutTransaction.company).toBeDefined()
        expect(sellOutTransaction.stock).toBeDefined()
        expect(sellOutTransaction.buyInTransaction).toBeDefined()
        expect(sellOutTransaction.operation).toBeDefined()
        expect(sellOutTransaction.quantity).toBeDefined()
        expect(sellOutTransaction.amount).toBeDefined()
        expect(sellOutTransaction.time).toBeDefined()

        expect(typeof sellOutTransaction.id).toEqual('string')
        expect(typeof sellOutTransaction.company).toEqual('object')
        expect(typeof sellOutTransaction.stock).toEqual('object')
        expect(typeof sellOutTransaction.buyInTransaction).toEqual('object')
        expect(typeof sellOutTransaction.operation).toEqual('string')
        expect(typeof sellOutTransaction.quantity).toEqual('number')
        expect(typeof sellOutTransaction.amount).toEqual('number')
        expect(typeof sellOutTransaction.time).toEqual('object')

      })

      it('should not create a new game if operation is not buy-in', async () => {

        let wrongOperation = 'buy-in'

        try {

          await sellOutStock(userId, companyId, stockId, buyInTransactionId, wrongOperation, quantity2)

          throw Error('should not reach this point')

          } catch (error) {
              expect(error).toBeDefined()
              expect(error).toBeInstanceOf(ConflictError)
              expect(error.message).toBeDefined()
              expect(typeof error.message).toEqual('string')
              expect(error.message.length).toBeGreaterThan(0)
              expect(error.message).toEqual(`this operation should be sell-out operation`)
          }

      })

      it('should not create a new game if userID is wrong', async () => {

        let userID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userID, companyId, stockId, buyInTransactionId, operation2, quantity2)
          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(typeof error.message).toEqual('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toEqual(`user with id ${userID} does not exists`)
        }

      })


      it('should not create a new game if CompanyID is wrong', async () => {

        let CompanyID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userId, CompanyID, stockId, buyInTransactionId, operation2, quantity2)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(typeof error.message).toEqual('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toEqual(`company with id ${CompanyID} does not exists`)
        }

      })

      it('should not create a new game if stockID is wrong', async () => {

        let StockID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userId, companyId, StockID, buyInTransactionId, operation2, quantity2)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(typeof error.message).toEqual('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toEqual(`stock with id ${StockID} does not exists`)
        }

      })

      it('should not create a new game if quantity is exceeded', async () => {

        let Quantity = 10000

        try {

          await sellOutStock(userId, companyId, stockId, buyInTransactionId, operation2, Quantity)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ConflictError)
            expect(error.message).toBeDefined()
            expect(typeof error.message).toEqual('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toEqual(`Transaction incompleted: remaining quantity is lower than your request of selling ${Quantity}`)
        }

      })

      it('should not create a new game if quantity is exceeded', async () => {

        let buyInTransactionID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userId, companyId, stockId, buyInTransactionID, operation2, quantity)

          throw Error('should not reach this point')

        } catch (error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toBeDefined()
            expect(typeof error.message).toEqual('string')
            expect(error.message.length).toBeGreaterThan(0)
            expect(error.message).toEqual(`buyInTransaction with id null does not exists`)
        }

      })


      afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])
      .then(database.disconnect))
})