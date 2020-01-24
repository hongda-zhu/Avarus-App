require('dotenv').config()
const { env: { TEST_DB_URL } } = process
const { expect } = require('chai')
const { random } = Math
const toggleFavs = require('.')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

describe('logic- toggle favs', () => {
    before(() => database.connect(TEST_DB_URL))
    let email, username, password, verifiedPassword, budget
    idFav = '5de2a988d1698e73a5664b1e'

    beforeEach(async () => {
        await User.deleteMany()

        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000
        transactions = []

        const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})

        userId = user.id
    })

    it ('should suceed on correct fav', async () => {
        
        const response = await toggleFavs(userId, idFav)
        expect(response).to.be.undefined
        user = await User.findById(userId)
        expect(user.favorites).to.be.an('array')
        expect(user.favorites).to.have.lengthOf(1)
        expect(user.favorites[0].toString()).to.deep.include(idFav)
        
    })

    describe('when user already exists', () => {
        beforeEach(async () => {
            user = await User.findById(userId)
            user.favorites.push(idFav)
            await user.save()
        })

        it ('should suceed on correct unfav', async () => {
        const response = await toggleFavs(userId, idFav)
            expect(response).to.be.undefined
            const user = await User.findById(userId)
            expect(user.favorites).to.be.an('array')
            expect(user.favorites).to.have.lengthOf(0)
        })
    })
    after(() => User.deleteMany().then(database.disconnect))
})