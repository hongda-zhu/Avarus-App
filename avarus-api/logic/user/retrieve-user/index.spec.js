require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const retrieveUser = require('.')
const { errors: { NotFoundError, ContentError, TypeError } } = require('avarus-util')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - retrieve user', () => {
    before(() => database.connect(TEST_DB_URL))

    let email, username, password, verifiedPassword, budget, id


    beforeEach(async () => {
        
        await User.deleteMany()

        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000
        transactions = []
  
        const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})
        id = user.id
    })

    it('should succeed on correct user id', async () => {
        const user = await retrieveUser(id)

        expect(user).to.exist
        expect(user.id).to.equal(id)
        expect(user._id).to.not.exist
        expect(user.email).to.equal(email)
        expect(user.username).to.equal(username)
    })

    it('should fail on wrong user id', async () => {
        const id = '123123123123'

        try {
            await retrieveUser(id)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).to.exist
            expect(error).to.be.an.instanceOf(NotFoundError)
            expect(error.message).to.equal(`usercase with id ${id} not found`)
        }
    })

    it('should fail on incorrect userId, companyId, transactionId or expression type and content', () => {

        expect(() => retrieveUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => retrieveUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => retrieveUser([])).to.throw(TypeError, ' is not a string')
        expect(() => retrieveUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => retrieveUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => retrieveUser(null)).to.throw(TypeError, 'null is not a string')
        expect(() => retrieveUser('')).to.throw(ContentError, 'id is empty or blank')
        expect(() => retrieveUser(' \t\r')).to.throw(ContentError, 'id is empty or blank')

    })

    after(() => User.deleteMany().then(database.disconnect))
})