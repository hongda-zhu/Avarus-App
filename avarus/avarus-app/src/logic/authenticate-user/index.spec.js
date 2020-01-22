require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {authenticateUser} = require('../index')
const { random} = Math
const { errors: { ContentError, CredentialsError } } = require('avarus-util')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - authenticate user', () => {
    
    beforeAll(() => database.connect(TEST_DB_URL))

    let email, username, password, verifiedPassword, budget, id
    
    beforeEach(async () => {
        await User.deleteMany()

        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000

        const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget})
        id = user.id
    })

    it('should succeed on correct credentials', async () => {
        const token = await authenticateUser(username, password)

        expect(token).toBeDefined()
        expect(typeof token).toEqual('string')
        expect(token.length).toBeGreaterThan(0)
        
        const [,payload,] = token.split('.')
        const {sub} = JSON.parse(atob(payload))
        expect(id).toBe(sub)
  
    })

    describe('when wrong credentials', () => {
        it('should fail on wrong username', async () => {
            const username = 'wrong'

            try {
                await authenticateUser(username, password)

                throw new Error('should not reach this point')
            } catch (error) {   

                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(CredentialsError)
                expect(error.message).toBeDefined()
                expect(error.message.length).toBeGreaterThan(0)
                expect(typeof error.message).toEqual('string')
                expect(error.message).toEqual(`wrong username`)
            }
        })

        it('should fail on wrong password', async () => {
            const password = 'wrong'

            try {
                await authenticateUser(username, password)

                throw new Error('should not reach this point')
            } catch (error) {
                
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(CredentialsError)
                expect(error.message).toBeDefined()
                expect(error.message.length).toBeGreaterThan(0)
                expect(typeof error.message).toEqual('string')
                expect(error.message).toEqual(`wrong password`)
            }
        })
    })

    it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
        expect(() => authenticateUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser([])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser('')).toThrow(ContentError, 'username is empty or blank')
        expect(() => authenticateUser(' \t\r')).toThrow(ContentError, 'username is empty or blank')

        expect(() => authenticateUser(email, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => authenticateUser(email, true)).toThrow(TypeError, 'true is not a string')
        expect(() => authenticateUser(email, [])).toThrow(TypeError, ' is not a string')
        expect(() => authenticateUser(email, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => authenticateUser(email, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => authenticateUser(email, null)).toThrow(TypeError, 'null is not a string')

        expect(() => authenticateUser(email, '')).toThrow(ContentError, 'password is empty or blank')
        expect(() => authenticateUser(email, ' \t\r')).toThrow(ContentError, 'password is empty or blank')
    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})