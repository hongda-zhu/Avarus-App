require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET} } = process
const {editUser} = require('../index')
const { random, floor } = Math
const { errors: { NotFoundError, CredentialsError} } = require('avarus-util')
const { ObjectId, database, models: { User} } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

fdescribe('logic - edit user', () => {
    beforeAll(() => database.connect(TEST_DB_URL))
    let email, username, password, verifiedPassword, budget, id, userId, transactions, token
    let newEmail, newPassword, newVerifiedPassword
  
    describe('when user is registed correctly', () => {
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
  
      it('should succeed on modify email using correct values', async () => {
        newEmail = `email-${random()}@mail.com`
        newPassword = newVerifiedPassword = undefined
        
        await editUser(token, newEmail, newPassword, newVerifiedPassword)
  
        const user = await User.findById(id)
      
        expect(user).toBeDefined()

        const [,payload,] = token.split('.')
        const {sub} = JSON.parse(atob(payload))
        expect(user.id).toEqual(sub)

        expect(user.username).toEqual(username)
        expect(user.email).toEqual(newEmail)
  
        let match = await bcrypt.compare(password, user.password)
        expect(match).toBeTruthy()

      })
  
      it('should succeed on modify password using correct values', async () => {
  
        newEmail = undefined
        newPassword = newVerifiedPassword = `password-${random()}`
  
        await editUser(token, newEmail, newPassword, newVerifiedPassword)
        const user = await User.findById(id)
  
        expect(user).toBeDefined()

        const [,payload,] = token.split('.')
        const {sub} = JSON.parse(atob(payload))
        expect(user.id).toEqual(sub)

        expect(user.username).toEqual(username)
        expect(user.email).toEqual(email)
  
        let match = await bcrypt.compare(newPassword, user.password)
        expect(match).toBeTruthy()
  
      })
  
      it('should failed on modify password without verified password', async () => {
        newEmail = undefined
        newPassword = `password-${random()}`
        newVerifiedPassword =  undefined
  
        try {
  
          await editUser(token, newEmail, newPassword, newVerifiedPassword)
  
          throw Error(`should not reach this point`)
  
        } catch (error) {
  
          expect(error).toBeDefined()
          expect(error.message).toBeDefined()
          expect(typeof error.message).toEqual('string')
          expect(error).toBeInstanceOf(CredentialsError)
          expect(error.message.length).toBeGreaterThan(0)
          expect(error.message).toEqual(`failed to modify password, passwords are not the same, please introduce correctly your password and it's verification`)
  
        }
      })
  
      it('should failed on modify password without verified password', async () => {
        newEmail = undefined
        newPassword = undefined
        newVerifiedPassword =  `password-${random()}`
  
        try {
  
          await editUser(token, newEmail, newPassword, newVerifiedPassword)
  
          throw Error(`should not reach this point`)
  
        } catch (error) {
  
          expect(error).toBeDefined()
          expect(error.message).toBeDefined()
          expect(typeof error.message).toEqual('string')
          expect(error).toBeInstanceOf(CredentialsError)
          expect(error.message.length).toBeGreaterThan(0)
          expect(error.message).toEqual(`failed to modify password, passwords are not the same, please introduce correctly your password and it's verification`)
  
        }
      })
  
      it('should fail on wrong user id', async () => {
        let wrongId = ObjectId().toString()
        let wrongToken = jwt.sign({sub: wrongId}, TEST_SECRET)
  
        try {
          await editUser(wrongToken)
  
          throw Error('should not reach this point')
        } catch (error) {

          expect(error).toBeDefined()
          expect(error.message).toBeDefined()
          expect(typeof error.message).toEqual('string')
          expect(error).toBeInstanceOf(NotFoundError)
          expect(error.message.length).toBeGreaterThan(0)
          expect(error.message).toEqual(`user with id ${wrongId} not found`)
        }
      })
  
      it('should fail on invalid data type of user id', async () => {
        let invalidId = 'sadasdasdasdasdasdas'
  
        try {
          await editUser(invalidId)
  
          throw Error('should not reach this point')
        } catch (error) {

          expect(error).toBeDefined()
          expect(error.message).toBeDefined()
          expect(typeof error.message).toEqual('string')
          expect(error).toBeInstanceOf(CredentialsError)
          expect(error.message.length).toBeGreaterThan(0)
          expect(error.message).toEqual(`jwt malformed`)
        }
      })
  
    })
    afterAll(() => User.deleteMany().then(database.disconnect))
  })