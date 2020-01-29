const { validate, errors: { ContentError, NotFoundError } } = require('avarus-util')
const { ObjectId, models: { Company, Stock } } = require('avarus-data')
const moment = require('moment')

const STOCKS_INTERVAL = 60000 

/**
 *
 * retrieve the produce-price
 * 
 * @returns {Number} 
 * 
 */

module.exports = function () {
    return (async () => {
        const companies = await Company.find()

        await Promise.all(companies.map(async company => {
            if (!company) throw new NotFoundError(`company with companyId ${companyId} not found`)

            if (!company.stocks.length) {
                const stock = new Stock({ price: 150, time: new Date('2020-01-29 00:00:00') })

                company.stocks.push(stock)
            }

            const lastStock = company.stocks[company.stocks.length - 1]

            let lastTime = lastStock.time.getTime()

            const diff = Date.now() - lastTime
            
            const gap = Math.floor(diff / STOCKS_INTERVAL)

            let lastPrice = lastStock.price

            for (let i = 0; i < gap; i++) {
                let newPrice = calculatePrice(company.market, lastPrice)

                const newTime = lastTime + STOCKS_INTERVAL

                const newStock = new Stock({ price: newPrice, time: new Date(newTime) })

                company.stocks.push(newStock)

                lastTime = newTime
                lastPrice = newPrice
            }

            await company.save()
        }))
    })()
}

function calculatePrice(market, previousPrice) {
    

    switch(market){
        case 'bear':
            return bearMarket(previousPrice)
        case 'bull':
            return bullMarket(previousPrice)
        case 'neutral':
            return neutralMarket(previousPrice)
    }
}

function bearMarket(previousPrice){
    if(Math.floor(Math.random()*10) > 6.4) {
        return previousPrice + (previousPrice * (Math.floor(Math.random() * (0.00125 - 0.0006)) + 0.0006))
    } else {
        return previousPrice - (previousPrice * (Math.floor(Math.random() * (0.0065 - 0.0002)) + 0.0002))
    }
}

function bullMarket(previousPrice){
    if(Math.floor(Math.random()*10) > 6.4) {
        return previousPrice + (previousPrice * (Math.floor(Math.random() * (0.00125 - 0.0006)) - 0.0006))
    } else {
        return previousPrice + (previousPrice * (Math.floor(Math.random() * (0.0075 - 0.0002)) + 0.0002))
    }
}


function neutralMarket(previousPrice){
    if(Math.floor(Math.random()*10) > 6.4) {
        return previousPrice + (previousPrice * (Math.floor(Math.random() * (0.00125 - 0.0006)) - 0.0006))
    } else {
        return previousPrice + (previousPrice * (Math.floor(Math.random() * (0.001 - 0.0005)) + 0.0005))
    }
}