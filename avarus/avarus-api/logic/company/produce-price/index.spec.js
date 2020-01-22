require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const producePrice = require('.')
const { random, floor } = Math
const { errors: { ContentError, NotFoundError, ConflictError } } = require('avarus-util')
const { database, models: { User, Company, Stock, Transaction, Sellout } } = require('avarus-data')

describe('logic - produce price', () => {
    before(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let companyId

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
        await producePrice()

        const company = await Company.findById(companyId)

        expect(company.stocks).to.have.length.greaterThan(0)

        const [ stock ] = company.stocks

        expect(stock).to.exist
        expect(stock.id).to.be.a('string')
        expect(stock.price).to.be.a('number')
        expect(stock.time).to.be.a('date')

      })

      after(() => Promise.all([User.deleteMany(), Company.deleteMany(), Stock.deleteMany(), Transaction.deleteMany(), Sellout.deleteMany()])
      .then(database.disconnect))
})