require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random, floor } = Math
const {retrieveCompanies} = require('../index')
const { errors: { NotFoundError } } = require('avarus-util')
const { ObjectId, database, models: { User, Company } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

fdescribe('logic - retrieve company', () => {

    beforeAll(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let name, description, risk, market, category, dependency, image, stocks, token, transactions, userId, companyId

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
        token = jwt.sign({sub: userId}, TEST_SECRET)
        
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
        
        const companies = await retrieveCompanies(undefined, token)
        
        companies.forEach(company => {
            expect(company).toBeDefined()
            expect(company._id).toEqual(companyId)
            expect(company.name).toEqual(name)
            expect(company.description).toEqual(description)
            expect(company.risk).toEqual(risk)
            expect(company.market).toEqual(market)
            expect(company.category).toEqual(category)
            expect(company.dependency).toEqual(dependency)
            expect(company.image).toEqual(image)
            expect(company.stocks).toEqual(stocks)

        })
    })

    it('should succeed on correct company category', async () => {
        
        const companies = await retrieveCompanies(category, token)

        companies.forEach(company => {
            expect(company).toBeDefined()
            expect(company._id).toEqual(companyId)
            expect(company.name).toEqual(name)
            expect(company.description).toEqual(description)
            expect(company.risk).toEqual(risk)
            expect(company.market).toEqual(market)
            expect(company.category).toEqual(category)
            expect(company.dependency).toEqual(dependency)
            expect(company.image).toEqual(image)
            expect(company.stocks).toEqual(stocks)

        })

    })

    it('should succeed on correct company name', async () => {
        
        const companies = await retrieveCompanies(name, token)

        companies.forEach(company => {
            expect(company).toBeDefined()
            expect(company._id).toEqual(companyId)
            expect(company.name).toEqual(name)
            expect(company.description).toEqual(description)
            expect(company.risk).toEqual(risk)
            expect(company.market).toEqual(market)
            expect(company.category).toEqual(category)
            expect(company.dependency).toEqual(dependency)
            expect(company.image).toEqual(image)
            expect(company.stocks).toEqual(stocks)

        })
    })

    it('should fail on wrong query', async () => {
        const wrongQuery = '123123123123'

        try {
            
            await retrieveCompanies(wrongQuery, token)
            
            throw Error('should not reach this point')
        } catch (error) {
            
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toEqual(`companies with query ${wrongQuery} does not exist`)
        }
    })

    it('should fail on wrong user id', async () => {
        const wrongUserId = ObjectId().toString()
        const wrongToken = jwt.sign({sub: wrongUserId}, TEST_SECRET)

        try {
            
            await retrieveCompanies(category, wrongToken)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toEqual(`user with id ${wrongUserId} does not exist`)
        }
    })

    afterAll(() => Promise.all([User.deleteMany(), Company.deleteMany()])
        
    .then(database.disconnect))
})