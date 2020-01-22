require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrievePrice = require('.')
const { errors: { NotFoundError } } = require('avarus-util')
const { database, models: { Company } } = require('avarus-data')

describe('logic - retrieve price', () => {

    before(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let name, description, risk, market, category, dependency, image, stocks

    beforeEach(async() => {  
        name = `name-${random()}`
        description = `description-${random()}`
        risk = risks[floor(random() * risks.length)]
        market = markets[floor(random() * markets.length)]
        category = categories[floor(random() * categories.length)]
        
        dependency = `dependency ${random()}`
        image = `image ${random()}`
        stocks = []

        await Company.deleteMany()

        const company = await Company.create({ name, description, risk, market, category, dependency, image, stocks})

        await company.save()

        id = company.id

    })

    it('should succeed on correct company id', async () => {
        
        const companyStocks = await retrievePrice(id)

        expect(stocks).to.exist
        expect(companyStocks).to.eql(stocks)
    })

    it('should fail on wrong company id', async () => {
        const id = '123123123123'

        try {
            await retrievePrice(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`company with id ${id} not found`)
        }
    })

    after(() => Company.deleteMany().then(database.disconnect))
})