require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const {retrieveUser} = require('../index')
const { errors: { NotFoundError, ContentError, TypeError } } = require('avarus-util')
const { ObjectId, database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

fdescribe('logic - retrieve user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

    let email, username, password, verifiedPassword, budget, id, token, transactions


    beforeEach(async () => {
        
        await User.deleteMany()

        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000
        transactions = []
  
        const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})

        id = user.id
        token = jwt.sign({sub: id}, TEST_SECRET)

        await user.save()
    })

    it('should succeed on correct user id', async () => {
        const user = await retrieveUser(token)

        expect(user).toBeDefined()
        
        const [,payload,] = token.split('.')
        const {sub} = JSON.parse(atob(payload))
        expect(user.id).toEqual(sub)

        expect(user.email).toEqual(email)
        expect(user.username).toEqual(username)
    })

    it('should fail on wrong user id', async () => {
        const wrongUserId = ObjectId().toString()
        const wrongToken = jwt.sign({sub: wrongUserId}, TEST_SECRET)

        try {
            await retrieveUser(wrongToken)

            throw Error('should not reach this point')
        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(NotFoundError)
            expect(error.message).toEqual(`usercase with id ${wrongUserId} not found`)
        }
    })

    it('should fail on incorrect userId, companyId, transactionId or expression type and content', () => {

        expect(() => retrieveUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => retrieveUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => retrieveUser([])).toThrow(TypeError, ' is not a string')
        expect(() => retrieveUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => retrieveUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => retrieveUser(null)).toThrow(TypeError, 'null is not a string')
        expect(() => retrieveUser('')).toThrow(ContentError, 'id is empty or blank')
        expect(() => retrieveUser(' \t\r')).toThrow(ContentError, 'id is empty or blank')

    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})