require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL} } = process
const {createPrice} = require('../index')
const { random, floor } = Math
const { errors: { ContentError, NotFoundError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction, Sellout } } = require('avarus-data')

describe('logic - create-price', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let companyId, price
    let quantity 

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

        const newStock = await createPrice(companyId, price)
        expect(newStock).toBeUndefined() 

        const [stock] = await Stock.find()
        expect(stock).toBeDefined()

        expect(stock.id).toBeDefined()
        expect(stock.price).toBeDefined()
        expect(stock.time).toBeDefined()
        expect(typeof stock.id).toEqual('string')
        expect(typeof stock.price).toEqual('number')
        expect(typeof stock.time).toEqual('object')

      })

      it('should not create the price of stock if companyId is incorrect', async () => {

        const companyID = '5de407687f38731d659c98e5'

        try {

          await createPrice(companyID, price)
          throw Error('should not reach this point')

          } catch (error) {
              expect(error).toBeDefined()
              expect(error).toBeInstanceOf(NotFoundError)
              expect(error.message).toBeDefined()
              expect(typeof error.message).toEqual('string')
              expect(error.message.length).toBeGreaterThan(0)
              expect(error.message).toEqual(`company with companyId ${companyID} not found`)
          }
      })

      it('should fail on incorrect inputs', ()=> {
          
            expect(() => createPrice(1)).toThrow(TypeError, '1 is not a string')
            expect(() => createPrice(true)).toThrow(TypeError, 'true is not a string')
            expect(() => createPrice([])).toThrow(TypeError, ' is not a string')
            expect(() => createPrice({})).toThrow(TypeError, '[object Object] is not a string')
            expect(() => createPrice(undefined)).toThrow(TypeError, 'undefined is not a string')
            expect(() => createPrice(null)).toThrow(TypeError, 'null is not a string')

            expect(() => createPrice('')).toThrow(ContentError, 'companyId is empty or blank')
            expect(() => createPrice(' \t\r')).toThrow(ContentError, 'companyId is empty or blank')

            expect(() => createPrice(companyId, true)).toThrow(TypeError, 'true is not a number')
            expect(() => createPrice(companyId, [])).toThrow(TypeError, ' is not a number')
            expect(() => createPrice(companyId, {})).toThrow(TypeError, '[object Object] is not a number')
            expect(() => createPrice(companyId, undefined)).toThrow(TypeError, 'undefined is not a number')
            expect(() => createPrice(companyId, null)).toThrow(TypeError, 'null is not a number')
      })

      afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])
      .then(database.disconnect))
})