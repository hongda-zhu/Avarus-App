require('dotenv').config()
const { env: { REACT_APP_TEST_DB_URL: TEST_DB_URL, REACT_APP_TEST_SECRET: TEST_SECRET } } = process
const { random } = Math
const {toggleFav :toggleFavs} = require('../index')
const { database, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



fdescribe('logic- toggle favs', () => {
    beforeAll(() => database.connect(TEST_DB_URL))
    let email, username, password, verifiedPassword, budget, transactions, userId, token

    let idFav = '5de2a988d1698e73a5664b1e'

    beforeEach(async () => {
        await User.deleteMany()

        email = `email-${random()}@mail.com`
        username = `username-${random()}`
        password = verifiedPassword = `password-${random()}`
        budget = 5000
        transactions = []

        const user = await User.create({  email, username, password: await bcrypt.hash(password, 10), verifiedPassword, budget, transactions})

        userId = user.id
        token = jwt.sign({sub: userId}, TEST_SECRET)
    })

    it ('should suceed on correct fav', async () => {
        
        const response = await toggleFavs(token, idFav)
        expect(response).toBeUndefined()
        let candidate = await User.findById(userId)
        expect(typeof candidate.favorites).toBe('object')
        expect(candidate.favorites).toHaveLength(1)
        expect(candidate.favorites[0].toString()).toBe(idFav)
        
    })

    describe('when user already exists', () => {
        beforeEach(async () => {
            let candidate = await User.findById(userId)
            candidate.favorites.push(idFav)
            await candidate.save()
        })

        it ('should suceed on correct unfav', async () => {
        const response = await toggleFavs(token, idFav)
            expect(response).toBeUndefined()
            let candidateUnFav = await User.findById(userId)
            expect(typeof candidateUnFav.favorites).toBe('object')
            expect(candidateUnFav.favorites).toHaveLength(0)
        })
    })

    afterAll(() => User.deleteMany().then(database.disconnect))
})