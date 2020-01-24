require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random, floor } = Math
const editCompany = require('.')
const { errors: { NotFoundError } } = require('avarus-util')
const { database, models: { Company } } = require('avarus-data')

describe('logic - edit company', () => {

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
        
        dependency = [`dependency ${random()}`]
        image = `image ${random()}`
        stocks = []

        await Company.deleteMany()

        const company = await Company.create({ name, description, risk, market, category, dependency, image, stocks})

        await company.save()

        id = company.id

    })

    it('should succeed on modify name and correct Company id', async () => {
      newName = `name-${random()}`
      newDescription = undefined
      newRisk = undefined
      newMarket = undefined
      newCategory = undefined
      newDependency = undefined
      newImage = undefined
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(newName)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(stocks)

    })

    it('should succeed on modify description and correct Company id', async () => {
      newName = undefined
      newDescription = `description-${random()}`
      newRisk = undefined
      newMarket = undefined
      newCategory = undefined
      newDependency = undefined
      newImage = undefined
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(newDescription)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify risk and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = `risk-${random()}`
      newMarket = undefined
      newCategory = undefined
      newDependency = undefined
      newImage = undefined
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(newRisk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify market and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = undefined
      newMarket = `market-${random()}`
      newCategory = undefined
      newDependency = undefined
      newImage = undefined
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(newMarket)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify category and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = undefined
      newMarket = undefined
      newCategory = `category-${random()}`
      newDependency = undefined
      newImage = undefined
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(newCategory)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify dependency and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = undefined
      newMarket = undefined
      newCategory = undefined
      newDependency = [`dependency-${random()}`]
      newImage = undefined
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(newDependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify imagen and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = undefined
      newMarket = undefined
      newCategory = undefined
      newDependency =undefined
      newImage = `imagen-${random()}`
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(newImage)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify imagen and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = undefined
      newMarket = undefined
      newCategory = undefined
      newDependency =undefined
      newImage = `imagen-${random()}`
      newStocks = undefined

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(newImage)
      expect(company.stocks).to.eql(stocks)
    })

    it('should succeed on modify newStocks and correct Company id', async () => {
      newName = undefined
      newDescription = undefined
      newRisk = undefined
      newMarket = undefined
      newCategory = undefined
      newDependency =undefined
      newImage = undefined
      newStocks = []

      await editCompany(id, newName, newDescription, newRisk, newMarket, newCategory, newDependency, newImage, newStocks)

      const company = await Company.findById(id)

      expect(company).to.exist
      expect(company.id).to.equal(id)
      expect(company.name).to.equal(name)
      expect(company.description).to.equal(description)
      expect(company.risk).to.equal(risk)
      expect(company.market).to.equal(market)
      expect(company.category).to.equal(category)
      expect(company.dependency).to.eql(dependency)
      expect(company.image).to.equal(image)
      expect(company.stocks).to.eql(newStocks)
    })


    it('should fail on wrong Company id', async () => {
      const id = '012345678901234567890123'

      try {
        await editCompany(id)

        throw Error('should not reach this point')
      } catch (error) {
        expect(error).to.exist
        expect(error).to.be.an.instanceOf(NotFoundError)
        expect(error.message).to.equal(`company with id ${id} not found`)
      }
    })
    after(() => Company.deleteMany().then(database.disconnect))
})