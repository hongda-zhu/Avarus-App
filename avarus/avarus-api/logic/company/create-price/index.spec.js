require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const createPrice = require('.')
const { random, floor } = Math
const { errors: { ContentError, NotFoundError, ConflictError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction, Sellout } } = require('avarus-data')

describe('logic - create-price', () => {
    before(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let companyId, price

    let companyname, description, risk, market, category, dependency, stocks, image     
    
        beforeEach(async () => {

            await Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany()])

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

            await company.save()

            price = floor(random() *10)

        })
      

      it('should process correctly the sell-out transaction when all the inputs are in correct position', async () => {

        const stock = await createPrice(companyId, price)

        expect(stock).to.exist
        expect(stock.id).to.be.a('string')
        expect(stock.price).to.be.a('number')
        expect(stock.time).to.be.a('date')

      })

      it('should not create the price of stock if companyId is incorrect', async () => {

        const companyID = '5de407687f38731d659c98e5'

        try {

          await createPrice(companyID, price)
          throw Error('should not reach this point')

          } catch (error) {
              expect(error).to.exist
              expect(error).to.be.an.instanceOf(NotFoundError)
              expect(error.message).to.equal(`company with companyId ${companyID} not found`)
          }
      })

      it('should not create the price of stock if companyId is incorrect', async () => {

        const companyID = '5de407687f38731d659c98e5'

        try {

          await createPrice(companyID, price)
          throw Error('should not reach this point')

          } catch (error) {
              expect(error).to.exist
              expect(error).to.be.an.instanceOf(NotFoundError)
              expect(error.message).to.equal(`company with companyId ${companyID} not found`)
          }
      })

      it('should fail on incorrect inputs', ()=> {
          
            expect(() => createPrice(1)).to.throw(TypeError, '1 is not a string')
            expect(() => createPrice(true)).to.throw(TypeError, 'true is not a string')
            expect(() => createPrice([])).to.throw(TypeError, ' is not a string')
            expect(() => createPrice({})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createPrice(undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createPrice(null)).to.throw(TypeError, 'null is not a string')

            expect(() => createPrice('')).to.throw(ContentError, 'companyId is empty or blank')
            expect(() => createPrice(' \t\r')).to.throw(ContentError, 'companyId is empty or blank')

            expect(() => createPrice(companyId, true)).to.throw(TypeError, 'true is not a number')
            expect(() => createPrice(companyId, [])).to.throw(TypeError, ' is not a number')
            expect(() => createPrice(companyId, {})).to.throw(TypeError, '[object Object] is not a number')
            expect(() => createPrice(companyId, undefined)).to.throw(TypeError, 'undefined is not a number')
            expect(() => createPrice(companyId, null)).to.throw(TypeError, 'null is not a number')
      })





      after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])
      .then(database.disconnect))
})