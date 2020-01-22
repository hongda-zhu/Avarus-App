require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const modufyUser = require('.')
const { errors: { NotFoundError, ContentError, ConflictError } } = require('avarus-util')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic - edit user', () => {
  before(() => database.connect(TEST_DB_URL))
  let email, username, password, verifiedPassword, budget, id
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
    })

    it('should succeed on modify email using correct values', async () => {
      newEmail = `email-${random()}@mail.com`
      newPassword = newVerifiedPassword = undefined
      
      await modufyUser(id, newEmail, newPassword, newVerifiedPassword)

      const user = await User.findById(id)
    
      expect(user).to.exist
      expect(user.id).to.equal(id)
      expect(user.username).to.equal(username)
      expect(user.email).to.equal(newEmail)

      let match = await bcrypt.compare(password, user.password)
      expect(match).to.be.true

    })

    it('should succeed on modify password using correct values', async () => {

      newEmail = undefined
      newPassword = newVerifiedPassword = `password-${random()}`

      await modufyUser(id, newEmail, newPassword, newVerifiedPassword)
      const user = await User.findById(id)

      expect(user).to.exist
      expect(user.id).to.equal(id)
      expect(user.username).to.equal(username)
      expect(user.email).to.equal(email)

      let match = await bcrypt.compare(newPassword, user.password)
      expect(match).to.be.true

    })

    it('should failed on modify password without verified password', async () => {
      newEmail = undefined
      newPassword = `password-${random()}`
      newVerifiedPassword =  undefined

      try {

        await modufyUser(id, newEmail, newPassword, newVerifiedPassword)

        throw Error(`should not reach this point`)

      } catch (error) {

        expect(error).to.exist
        expect(error.message).to.exist
        expect(typeof error.message).to.equal('string')
        expect(error).to.be.an.instanceOf(ConflictError)
        expect(error.message.length).to.be.greaterThan(0)
        expect(error.message).to.equal(`failed to modify password, passwords are not the same, please introduce correctly your password and it's verification`)

      }
    })

    it('should failed on modify password without verified password', async () => {
      newEmail = undefined
      newPassword = undefined
      newVerifiedPassword =  `password-${random()}`

      try {

        await modufyUser(id, newEmail, newPassword, newVerifiedPassword)

        throw Error(`should not reach this point`)

      } catch (error) {

        expect(error).to.exist
        expect(error.message).to.exist
        expect(typeof error.message).to.equal('string')
        expect(error).to.be.an.instanceOf(ConflictError)
        expect(error.message.length).to.be.greaterThan(0)
        expect(error.message).to.equal(`failed to modify password, passwords are not the same, please introduce correctly your password and it's verification`)

      }
    })

    it('should fail on wrong user id', async () => {
      let wrongId = '012345678901234567890123'

      try {
        await modufyUser(wrongId)

        throw Error('should not reach this point')
      } catch (error) {
        expect(error).to.exist
        expect(error).to.be.an.instanceOf(NotFoundError)
        expect(error.message).to.equal(`user with id ${wrongId} not found`)
      }
    })

    it('should fail on invalid data type of user id', async () => {
      let invalidId = 'sadasdasdasdasdasdas'

      try {
        await modufyUser(invalidId)

        throw Error('should not reach this point')
      } catch (error) {
        expect(error).to.exist
        expect(error).to.be.an.instanceOf(ContentError)
        expect(error.message).to.equal(`${invalidId} is not a valid id`)
      }
    })

  })
  after(() => User.deleteMany().then(database.disconnect))
})