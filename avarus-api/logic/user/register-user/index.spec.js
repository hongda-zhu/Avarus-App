require('dotenv').config()
const { env: { TEST_DB_URL} } = process
const { expect } = require('chai')
const registerUser = require('.')
const { random } = Math
const { errors: { ContentError, ConflictError } } = require('avarus-util')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - register user', () => {
    before(() => database.connect(TEST_DB_URL))

    let email, username, password, verifiedPassword, budget 

    
    beforeEach(async() => {
        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000
        

        await User.deleteMany()
    })

    it('should succeed on correct credentials', async () => {
        const result = await registerUser(email, username, password,verifiedPassword, budget)
        expect(result).not.to.exist

        const user = await User.findOne({ username })
        expect(user).to.exist
        expect(user.email).to.equal(email)
        expect(user.username).to.equal(username)
        expect(user.budget).to.equal(budget)

        const match = await bcrypt.compare(password, user.password)
        expect(match).to.be.true
      
    })

    it('should failed on wrong verification of password', async () => {

        const wrongPassword = '12122121'

        try {

            await registerUser(email, username, password,wrongPassword, budget)

            throw Error('should not reach this point')

        } catch(error) {

            expect(error).to.exist
            expect(error).to.be.an.instanceOf(ConflictError)
            expect(error.message).to.exist
            expect(typeof error.message).to.equal('string')
            expect(error.message.length).to.be.greaterThan(0)
            expect(error.message).to.equal(`failed to verify, passwords are not the same, please introduce correctly your password and verify password`)
        }


    })

 
    it('should fail on already existing user', async () => {

        await User.create({ email, username, password, verifiedPassword,budget })
            try {
                await registerUser(email, username, password, verifiedPassword, budget)

                throw Error('should not reach this point')
            } catch (error) {
                expect(error).to.exist
                expect(error).to.be.an.instanceOf(ConflictError)
                expect(error.message).to.exist
                expect(typeof error.message).to.equal('string')
                expect(error.message.length).to.be.greaterThan(0)
                expect(error.message).to.equal(`user with username ${username} already exists`)
            }
    })
    
    it('should fail on incorrect email, password, username, verified password or expression type and content', () => {

        
        expect(() => registerUser(1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser([])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser({})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser('')).to.throw(ContentError, 'email is empty or blank')
        expect(() => registerUser(' \t\r')).to.throw(ContentError, 'email is empty or blank')

        expect(() => registerUser(email, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(email, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(email, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(email, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(email, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(email, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser(email, '')).to.throw(ContentError, 'username is empty or blank')
        expect(() => registerUser(email, ' \t\r')).to.throw(ContentError, 'username is empty or blank')

        expect(() => registerUser(email, username, '')).to.throw(ContentError, 'password is empty or blank')
        expect(() => registerUser(email, username, ' \t\r')).to.throw(ContentError, 'password is empty or blank')

        expect(() => registerUser(email, username, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(email, username, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(email, username, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(email, username, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(email, username, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(email, username, null)).to.throw(TypeError, 'null is not a string')

        expect(() => registerUser(email, username, password, '')).to.throw(ContentError, 'verifiedPassword is empty or blank')
        expect(() => registerUser(email, username, password, ' \t\r')).to.throw(ContentError, 'verifiedPassword is empty or blank')

        expect(() => registerUser(email, username, password, 1)).to.throw(TypeError, '1 is not a string')
        expect(() => registerUser(email, username, password, true)).to.throw(TypeError, 'true is not a string')
        expect(() => registerUser(email, username, password, [])).to.throw(TypeError, ' is not a string')
        expect(() => registerUser(email, username, password, {})).to.throw(TypeError, '[object Object] is not a string')
        expect(() => registerUser(email, username, password, undefined)).to.throw(TypeError, 'undefined is not a string')
        expect(() => registerUser(email, username, password, null)).to.throw(TypeError, 'null is not a string')


    })

    after(() => User.deleteMany().then(database.disconnect))
})