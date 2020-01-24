require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const sellOutStock = require('.')
const { random, floor } = Math
const { errors: { NotFoundError, ConflictError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction, Sellout } } = require('avarus-data')
const bcrypt = require('bcryptjs')


describe('logic - sell-out', () => {
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

        const sellOutTransaction = await sellOutStock(userId, companyId, stockId, buyInTransactionId, operation2, quantity2)

        

        expect(sellOutTransaction).to.exist
        expect(sellOutTransaction.id).to.be.a('string')
        expect(sellOutTransaction.company).to.be.a('object')
        expect(sellOutTransaction.stock).to.be.a('object')
        expect(sellOutTransaction.buyInTransaction).to.be.a('object')
        expect(sellOutTransaction.operation).to.be.a('string')
        expect(sellOutTransaction.quantity).to.be.a('number')
        expect(sellOutTransaction.amount).to.be.a('number')
        expect(sellOutTransaction.time).to.be.a('date')

      })

      it('should not create a new game if operation is not buy-in', async () => {

        let wrongOperation = 'buy-in'

        try {

          await sellOutStock(userId, companyId, stockId, buyInTransactionId, wrongOperation, quantity2)

          throw Error('should not reach this point')

          } catch (error) {
              expect(error).to.exist
              expect(error).to.be.an.instanceOf(ConflictError)
              expect(error.message).to.equal(`this operation should be sell-out operation`)
          }

      })

      it('should not create a new game if userID is wrong', async () => {

        let userID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userID, companyId, stockId, buyInTransactionId, operation2, quantity2)
          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userID} does not exists`)
        }

      })


      it('should not create a new game if CompanyID is wrong', async () => {

        let CompanyID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userId, CompanyID, stockId, buyInTransactionId, operation2, quantity2)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`company with id ${CompanyID} does not exists`)
        }

      })

      it('should not create a new game if stockID is wrong', async () => {

        let StockID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userId, companyId, StockID, buyInTransactionId, operation2, quantity2)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`stock with id ${StockID} does not exists`)
        }

      })

      it('should not create a new game if quantity is exceeded', async () => {

        let Quantity = 10000

        try {

          await sellOutStock(userId, companyId, stockId, buyInTransactionId, operation2, Quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            expect(error.message).to.equal(`Transaction incompleted: remaining quantity is lower than your request of selling ${Quantity}`)
        }

      })

      it('should not create a new game if quantity is exceeded', async () => {

        let buyInTransactionID = "5de407687f38731d659c98e5"

        try {

          await sellOutStock(userId, companyId, stockId, buyInTransactionID, operation2, quantity)

          throw Error('should not reach this point')

        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`buyInTransaction with id null does not exists`)
        }

      })


      after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])
      .then(database.disconnect))
})