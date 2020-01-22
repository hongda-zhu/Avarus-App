require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const retrieveCompanies = require('.')
const { errors: { NotFoundError } } = require('avarus-util')
const { database, models: { User, Company } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve company', () => {

    before(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let name, description, risk, market, category, dependency, image, stocks

    let email, username, password, verifiedPassword, budget

    beforeEach(async() => {

        await Promise.all([User.deleteMany(), Company.deleteMany()])
        
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000
        transactions = []
  
        const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})

        await user.save()
        userId = user.id

        
        name = `name-${random()}`
        description = `description-${random()}`
        risk = risks[floor(random() * risks.length)]
        market = markets[floor(random() * markets.length)]
        category = categories[floor(random() * categories.length)]
        
        dependency = [`dependency ${random()}`]
        image = `image ${random()}`
        stocks = []

        await Company.deleteMany()

        const company = await Company.create({ name, description, risk, market, category, dependency, image, stocks})

        await company.save()

        companyId = company.id

    })

    it('should succeed on correct company id', async () => {
        
        const companies = await retrieveCompanies(undefined, userId)
        
        companies.forEach(company => {
            expect(company).to.exist
            expect(company.id).to.equal(companyId)
            expect(company.name).to.equal(name)
            expect(company.description).to.equal(description)
            expect(company.risk).to.equal(risk)
            expect(company.market).to.equal(market)
            expect(company.category).to.equal(category)
            expect(company.dependency).to.eql(dependency)
            expect(company.image).to.equal(image)
            expect(company.stocks).to.eql(stocks)

        })
    })

    it('should succeed on correct company category', async () => {
        
        const companies = await retrieveCompanies(category, userId)

        
        
        companies.forEach(company => {
            expect(company).to.exist
            expect(company.id).to.equal(companyId)
            expect(company.name).to.equal(name)
            expect(company.description).to.equal(description)
            expect(company.risk).to.equal(risk)
            expect(company.market).to.equal(market)
            expect(company.category).to.equal(category)
            expect(company.dependency).to.eql(dependency)
            expect(company.image).to.equal(image)
            expect(company.stocks).to.eql(stocks)

        })

    })

    it('should succeed on correct company name', async () => {
        
        const companies = await retrieveCompanies(name, userId)

        companies.forEach(company => {
            expect(company).to.exist
            expect(company.id).to.equal(companyId)
            expect(company.name).to.equal(name)
            expect(company.description).to.equal(description)
            expect(company.risk).to.equal(risk)
            expect(company.market).to.equal(market)
            expect(company.category).to.equal(category)
            expect(company.dependency).to.eql(dependency)
            expect(company.image).to.equal(image)
            expect(company.stocks).to.eql(stocks)

        })
    })

    it('should fail on wrong query', async () => {
        const wrongQuery = '123123123123'

        try {
            
            await retrieveCompanies(wrongQuery, userId)
            debugger
            throw Error('should not reach this point')
        } catch (error) {
            
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`companies with query ${wrongQuery} does not exist`)
        }
    })

    it('should fail on wrong user id', async () => {
        const userID = '123123123123'

        try {
            
            await retrieveCompanies(category, userID)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`user with id ${userID} does not exist`)
        }
    })

    after(() => Promise.all([User.deleteMany(), Company.deleteMany()])
        
    .then(database.disconnect))
})