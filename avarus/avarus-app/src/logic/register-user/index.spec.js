const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL } } = process
const {registerUser} = require('../index')
const { random } = Math
const { errors: { ContentError, ConflictError } } = require('avarus-util')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - register user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))

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

        expect(result).toBeUndefined()

        const users = await User.find()
        const [user] = users
        
        expect(user).toBeDefined()

        expect(user.email).toBe(email)
        expect(user.username).toBe(username)
        expect(user.budget).toBe(budget)

        const match = await bcrypt.compare(password, user.password)
        expect(match).toBe.true
      
    })

    it('should failed on wrong verification of password', async () => {

        const wrongPassword = '12122121'

        try {

            await registerUser(email, username, password,wrongPassword, budget)

            throw Error('should not reach this point')

        } catch(error) {

            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(ConflictError)
            expect(error.message).toBeDefined()
            expect(error.message.length).toBeGreaterThan(0)
            expect(typeof error.message).toEqual('string')
            expect(error.message).toEqual(`failed to verify, passwords are not the same, please introduce correctly your password and verify password`)
        }
    })

    it('should fail on already existing user', async () => {

        await User.create({ email, username, password, verifiedPassword,budget })
            try {
                await registerUser(email, username, password, verifiedPassword, budget)

                throw Error('should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error).toBeInstanceOf(ConflictError)
                expect(error.message).toBeDefined()
                expect(typeof error.message).toEqual('string')
                expect(error.message.length).toBeGreaterThan(0)
                expect(error.message).toEqual(`user with username ${username} already exists`)
            }
    })

    it('should fail on incorrect email, password, username, verified password or expression type and content', () => {

        
        expect(() => registerUser(1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser([])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser({})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser('')).toThrow(ContentError, 'email is empty or blank')
        expect(() => registerUser(' \t\r')).toThrow(ContentError, 'email is empty or blank')

        expect(() => registerUser(email, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(email, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(email, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(email, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(email, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(email, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(email, '')).toThrow(ContentError, 'username is empty or blank')
        expect(() => registerUser(email, ' \t\r')).toThrow(ContentError, 'username is empty or blank')

        expect(() => registerUser(email, username, '')).toThrow(ContentError, 'password is empty or blank')
        expect(() => registerUser(email, username, ' \t\r')).toThrow(ContentError, 'password is empty or blank')

        expect(() => registerUser(email, username, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(email, username, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(email, username, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(email, username, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(email, username, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(email, username, null)).toThrow(TypeError, 'null is not a string')

        expect(() => registerUser(email, username, password, '')).toThrow(ContentError, 'verifiedPassword is empty or blank')
        expect(() => registerUser(email, username, password, ' \t\r')).toThrow(ContentError, 'verifiedPassword is empty or blank')

        expect(() => registerUser(email, username, password, 1)).toThrow(TypeError, '1 is not a string')
        expect(() => registerUser(email, username, password, true)).toThrow(TypeError, 'true is not a string')
        expect(() => registerUser(email, username, password, [])).toThrow(TypeError, ' is not a string')
        expect(() => registerUser(email, username, password, {})).toThrow(TypeError, '[object Object] is not a string')
        expect(() => registerUser(email, username, password, undefined)).toThrow(TypeError, 'undefined is not a string')
        expect(() => registerUser(email, username, password, null)).toThrow(TypeError, 'null is not a string')


    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})