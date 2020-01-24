require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const createCompany = require('.')
const { random, floor } = Math
const { errors: { ContentError } } = require('avarus-util')
const { database, models: { Company } } = require('avarus-data')

describe('logic - create company', () => {
    
    before(() => database.connect(TEST_DB_URL))

    let risks = ['adverse', 'neutral', 'seek']
    let markets = ['bear','bull', 'neutral']
    let categories = ['tech', 'food', 'banking', 'sports', 'gaming', 'fashion']

    let name, description, risk, market, category, dependency, stocks, image 
    
    beforeEach(() => {  
        name = `name-${random()}`
        description = `description-${random()}`
        risk = risks[floor(random() * risks.length)]
        market = markets[floor(random() * markets.length)]
        category = categories[floor(random() * categories.length)]
        
        dependency = [`dependency ${random()}`]
        image = `image ${random()}`
        stocks = []

        return Company.deleteMany()
    })

    it('should create a new company on correct set of datas', async () => { 
        const result = await createCompany(name, description, risk, market, category, dependency, image, stocks)

        expect(result).not.to.exist
        
        const company = await Company.findOne({ name })
        expect(company).to.exist
        expect(company.name).to.equal(name)
        expect(company.description).to.equal(description)
        expect(company.risk).to.equal(risk)
        expect(company.market).to.equal(market)
        expect(company.category).to.equal(category)
        expect(company.dependency).to.eql(dependency)
        expect(company.image).to.equal(image)
        expect(stocks).to.equal(stocks)
    })

    describe('when company already exists', () => {
        beforeEach(() => Company.create({ name, description, risk, market, category, dependency, image, stocks }))
    
        it('should fail on already existing company', async () => {
          try {
            await createCompany( name, description, risk, market, category, dependency, image, stocks )

            throw Error('should not reach this point')
          } catch (error) {
            expect(error).to.exist
    
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`company with name ${name} already exists`)
          }
        })


        it('should fail on incorrect name, description, risk, market, category, dependency, image, stocks, or expression type and content', () => {

            

            expect(() => createCompany(1)).to.throw(TypeError, '1 is not a string')
            expect(() => createCompany(true)).to.throw(TypeError, 'true is not a string')
            expect(() => createCompany([])).to.throw(TypeError, ' is not a string')
            expect(() => createCompany({})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createCompany(undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createCompany(null)).to.throw(TypeError, 'null is not a string')
        
            expect(() => createCompany('')).to.throw(ContentError, 'name is empty or blank')
            expect(() => createCompany(' \t\r')).to.throw(ContentError, 'name is empty or blank')

            expect(() => createCompany(name, 1)).to.throw(TypeError, '1 is not a string')
            expect(() => createCompany(name, true)).to.throw(TypeError, 'true is not a string')
            expect(() => createCompany(name, [])).to.throw(TypeError, ' is not a string')
            expect(() => createCompany(name, {})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createCompany(name, undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createCompany(name, null)).to.throw(TypeError, 'null is not a string')
        
            expect(() => createCompany(name, '')).to.throw(ContentError, 'description is empty or blank')
            expect(() => createCompany(name, ' \t\r')).to.throw(ContentError, 'description is empty or blank')

            expect(() => createCompany(name, description, 1)).to.throw(TypeError, '1 is not a string')
            expect(() => createCompany(name, description, true)).to.throw(TypeError, 'true is not a string')
            expect(() => createCompany(name, description, [])).to.throw(TypeError, ' is not a string')
            expect(() => createCompany(name, description, {})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createCompany(name, description, undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createCompany(name, description, null)).to.throw(TypeError, 'null is not a string')
        
            expect(() => createCompany(name, description,  '')).to.throw(ContentError, 'risk is empty or blank')
            expect(() => createCompany(name, description, ' \t\r')).to.throw(ContentError, 'risk is empty or blank')

            expect(() => createCompany(name, description, risk, 1)).to.throw(TypeError, '1 is not a string')
            expect(() => createCompany(name, description, risk, true)).to.throw(TypeError, 'true is not a string')
            expect(() => createCompany(name, description, risk, [])).to.throw(TypeError, ' is not a string')
            expect(() => createCompany(name, description, risk, {})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createCompany(name, description, risk,undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createCompany(name, description, risk, null)).to.throw(TypeError, 'null is not a string')
        
            expect(() => createCompany(name, description, risk, '')).to.throw(ContentError, 'market is empty or blank')
            expect(() => createCompany(name, description, risk, ' \t\r')).to.throw(ContentError, 'market is empty or blank')

            expect(() => createCompany(name, description, risk, market, 1)).to.throw(TypeError, '1 is not a string')
            expect(() => createCompany(name, description, risk, market, true)).to.throw(TypeError, 'true is not a string')
            expect(() => createCompany(name, description, risk, market, [])).to.throw(TypeError, ' is not a string')
            expect(() => createCompany(name, description, risk, market, {})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createCompany(name, description, risk, market, undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createCompany(name, description, risk, market,
            null)).to.throw(TypeError, 'null is not a string')
        
            expect(() => createCompany(name, description, risk, market, '')).to.throw(ContentError, 'category is empty or blank')
            expect(() => createCompany(name, description, risk, market, ' \t\r')).to.throw(ContentError, 'category is empty or blank')

            expect(() => createCompany(name, description, risk, market, category, 1)).to.throw(TypeError, '1 is not a Array')
            expect(() => createCompany(name, description, risk, market, category, true)).to.throw(TypeError, 'true is not a Array')
            expect(() => createCompany(name, description, risk, market, category, {})).to.throw(TypeError, '[object Object] is not a Array')
            expect(() => createCompany(name, description, risk, market, category, undefined)).to.throw(TypeError, 'undefined is not a Array')
            expect(() => createCompany(name, description, risk, market, category, null)).to.throw(TypeError, 'null is not a Array')
        

            expect(() => createCompany(name, description, risk, market, category, dependency, 1)).to.throw(TypeError, '1 is not a string')
            expect(() => createCompany(name, description, risk, market, category, dependency, true)).to.throw(TypeError, 'true is not a string')
            expect(() => createCompany(name, description, risk, market, category, dependency, [])).to.throw(TypeError, ' is not a string')
            expect(() => createCompany(name, description, risk, market, category, dependency, {})).to.throw(TypeError, '[object Object] is not a string')
            expect(() => createCompany(name, description, risk, market, category, dependency, undefined)).to.throw(TypeError, 'undefined is not a string')
            expect(() => createCompany(name, description, risk, market, category, dependency, null)).to.throw(TypeError, 'null is not a string')
  
            expect(() => createCompany(name, description, risk, market, category, dependency, '')).to.throw(ContentError, 'image is empty or blank')
            expect(() => createCompany(name, description, risk, market, category, dependency, ' \t\r')).to.throw(ContentError, 'image is empty or blank')

            expect(() => createCompany(name, description, risk, market, category, dependency, image, 1)).to.throw(TypeError, '1 is not a Array')
            expect(() => createCompany(name, description, risk, market, category, dependency, image, true)).to.throw(TypeError, 'true is not a Array')
            expect(() => createCompany(name, description, risk, market, category, dependency, image, 'abc')).to.throw(TypeError, 'abc is not a Array')
            expect(() => createCompany(name, description, risk, market, category, dependency, image, {})).to.throw(TypeError, '[object Object] is not a Array')
            expect(() => createCompany(name, description, risk, market, category, dependency, image, undefined)).to.throw(TypeError, 'undefined is not a Array')
            expect(() => createCompany(name, description, risk, market, category, dependency, image, null)).to.throw(TypeError, 'null is not a Array')
        })
    })
    after(() => Company.deleteMany().then(database.disconnect))
})