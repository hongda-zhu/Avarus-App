module.exports = {
    // User
    authenticateUser: require('./user/authenticate-user'),
    registerUser: require('./user/register-user'),
    retrieveUser: require('./user/retrieve-user'),
    retrieveBuyin: require('./user/retrieve-buyIn'),
    retrieveSellout: require('./user/retrieve-sellout'),
    editUser: require('../logic/user/edit-user'),
    buyIn: require('./user/buy-in-stock'),
    sellOut: require('./user/sell-out-stock'),
    toggleFav : require('./user/toggle-fav'),
    saveUserPicture: require('./user/save-user-picture'),
    loadUserPicture: require('./user/load-user-picture'),

    // Company
    createCompany: require('./company/create-company'),
    createPrice: require('./company/create-price'),
    producePrice: require('./company/produce-price'),
    retrieveCompanies: require('./company/retrieve-companies'),
    retrieveCompany: require('./company/retrieve-company'),
    retrievePrice: require('./company/retrieve-price'),
    retrievePrices: require('./company/retrieve-prices'),
    editCompany: require('./company/edit-company'),

    // Comment
    createComment: require('./comment/create-comment'),
    editComment: require('./comment/edit-comment'),
    retrieveComments: require('./comment/retrieve-comments'),
    deleteComment: require('./comment/delete-comment')
}