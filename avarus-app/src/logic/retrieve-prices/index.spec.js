require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL} } = process
const { random, floor } = Math
const {retrievePrices} = require('../index')
const { errors: { NotFoundError } } = require('avarus-util')
const { database, models: { Company, Stock } } = require('avarus-data')

fdescribe('logic - retrieve prices', () => { 


    beforeAll(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let name, description, risk, market, category, dependency, image, stocks, id

    let price, time

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

        price = random()
        
        time = new Date

        const stock = await Stock.create({price: price, time: time})

        company.stocks.push(stock)

        await company.save()

        id = company.id

    })

    it('should succeed on correct company id', async () => {

        const pricesVariations = await retrievePrices(id)

        expect(pricesVariations).toBeDefined()

        expect(pricesVariations.averagePrice).toBeDefined()
        expect(typeof pricesVariations.averagePrice).toBe('number')

        expect(pricesVariations.higherPrice).toBeDefined()
        expect(typeof pricesVariations.higherPrice).toBe('number')

        expect(pricesVariations.lowerPrice).toBeDefined()
        expect(typeof pricesVariations.lowerPrice).toBe('number')

    })

    it('should fail on wrong company id', async () => {

        const id = '123123123123'

        try {
            await retrievePrices(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toEqual(`company with id ${id} not found`)
        }
    })

    afterAll(() => Company.deleteMany().then(database.disconnect))
})