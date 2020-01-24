require('dotenv').config()
const moment = require('moment')
const { database, models: { Company, Stock } } = require('avarus-data')
const { env: { DB_URL } } = process;
const fetch = require('node-fetch');

(async () => {
    try {
        await database.connect(DB_URL)

        await Company.deleteMany()


        const company1 = new Company({
            name: 'blanco-blanco',
            description: 'The blanco-blanco company',
            risk: 'seek',
            category: 'food',
            market: 'bull',
        })

        const company2 = new Company({
            name: 'bontempi-bontempi',
            description: 'The bontempi-bontempi company',
            risk: 'adverse',
            category: 'sports',
            market: 'bear',
        })
        const company3 = new Company({
            name: 'navarro-navarro',
            description: 'The navarro-navarro company',
            risk: 'neutral',
            category: 'sports',
            market: 'neutral',

        })
        
        await company1.save()

        await company2.save()

        await company3.save()


        // moment example

        // const data = (await fetch('https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=MSFT&apikey=demo').then(res => res.json()))['Monthly Time Series']

        // for (const key in data) {

        //     const price = Number(data[key]['4. close'])

        //     const time = new Date(key)

        //     const stock = new Stock({ price, time })

        //     company1.stocks.push(stock)

        // }

        await company1.save()
    } catch (error) {
        console.error(error)
    }
})()

// moment example

// const now = moment()

// const before = moment().subtract(1, 'months')

// let first = true

// while (now.diff(before) > 0) {
//     before.add(first? 0 : 10, 'minutes')

//     first = false

//     const stock = new Stock({
//         price: 10,
//         time: before.toDate()
//     })

//     company1.stocks.push(stock)

//     console.log(stock.toJSON())
// }