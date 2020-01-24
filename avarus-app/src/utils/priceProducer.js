// const { random, floor } = Math
// const {createPrice} = require('avarus-api/logic/')

// // Start 

// module.exports = function priceCalculator(object){
//     const {market} = object
//     switch(market){
//         case 'bull':
//             return bullMarket(object);
//             break;

//         case 'bear':
//             return bearMarket(object);
//             break;
        
//         case 'neutral':
//             return neutralMarket(object);
//             break;
//     }
// }

// // Market

// function bullMarket(object){
//     

//     const lastPrice = object.stocks[object.stocks.length - 1]

//     if(lastPrice === null || undefined ) {object.stocks.push(createPrice(object.id, price = 70))}

    

//     let mathRandom = Math.floor(Math.random() * (0.0009 - 0.0004)) + 0.0004

//     const newPrice = lastPrice.price + (lastPrice.price * mathRandom)

//     return newPrice
// }

// function bearMarket(object){

//     const lastPrice = object.stocks[object.stocks.length - 1]

//     if(lastPrice === null || undefined ) {object.stocks.push(createPrice(object.id, price = 55))}
//     let mathRandom = Math.floor(Math.random() * (0.0008 - 0.0003)) + 0.0003


//     const newPrice = lastPrice.price + (lastPrice.price * mathRandom)

//     return newPrice
// }

// function neutralMarket(object){

//     const lastPrice = object.stocks[object.stocks.length - 1]

//     if(lastPrice === null || undefined) {object.stocks.push(createPrice(object.id, price = 80))}
//     let mathRandom = Math.floor(Math.random() * (0.0007 - 0.0002)) + 0.0002

//     const newPrice = lastPrice.price + (lastPrice.price * mathRandom)

//     return newPrice
// }