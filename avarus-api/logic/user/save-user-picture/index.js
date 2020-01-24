// require('dotenv').config()
// const { validate, errors: { NotFoundError, ContentError }  } = require('avarus-util')
// const { ObjectId, models: { User } } = require('avarus-data')
// const fs = require('fs')
// const path = require('path')

// module.exports = function (id, file, filename) {
//     validate.string(id)
//     validate.string.notVoid('id', id)
//     if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

//     return (async () => {
//         const user = await User.findById(id)
//         if (!user) throw new NotFoundError(`user with id ${id} not found`)
        
//         const dir = `./data/users/${id}`
//         if (!fs.existsSync(dir)){
//             fs.mkdirSync(dir, {recursive: true}, err => {})
//         }
//         let saveTo = path.join(__dirname, `../../data/users/${id}/${filename}`)
//         return file.pipe(fs.createWriteStream(saveTo))            
//     })()
// }

require('dotenv').config()
const { validate } = require('avarus-util')
const { ObjectId, models: { User } } = require('avarus-data')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

/**
 * Saves user profile image.
 * 
 * @param {ObjectId} id
 * @param {Stream} file
 * @param {Sting} filename 
 *
 * @returns {Promise} - user.  
 */


module.exports = function(id, file, filename) {
    debugger
    validate.string(id)
    validate.string.notVoid('id', id)
    if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)
    return (async() => {
        
        // const route = path.join(__dirname, `../../public/data/users/${id}/`)
        // const imgPath = path.join(__dirname, `../../public/data/users/${id}/${filename}`)

        const route = path.join(__dirname, `../../data/users/${id}/`)
        const imgPath = path.join(__dirname, `../../data/users/${id}/${filename}`)

        try {
    
            const user = await User.findById(id)
            user.image = `http://localhost:8000/data/users/${id}/${filename}`
            await user.save()
            if (fs.existsSync(route)) {
                return file.pipe(fs.createWriteStream(imgPath))
            } else {
                fs.mkdirSync(route, {recursive: true}, err => {`${err}`})
                return file.pipe(fs.createWriteStream(imgPath))
            }
        } catch (error) {
            return "error saving image"
        }
    })()
}