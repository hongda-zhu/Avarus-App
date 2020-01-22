const { validate, errors: {NotFoundError, ContentError, ConflictError } } = require('avarus-util')
const { ObjectId, models: { User } } = require('avarus-data')
const bcrypt = require('bcryptjs')

/**
 *
 * edit-user
 * 
 * @param {id} ObjectId
 * @param {name} string
 * @param {surname} string
 * @param {username} string
 * 
 * @returns {ObjectId} 
 * 
 */


module.exports = function(id, email, password, verifiedPassword) {
  debugger
  validate.string(id)
  validate.string.notVoid('id', id)
  if (!ObjectId.isValid(id)) throw new ContentError(`${id} is not a valid id`)

  if (email) {
    validate.string(email)
    validate.string.notVoid('email', email)
    validate.email(email)
  }

  if (password) {
    validate.string(password)
    validate.string.notVoid('password', password)
    
  }

  if (verifiedPassword) {
    validate.string.notVoid('verifiedPassword', verifiedPassword)
    validate.string(verifiedPassword)
  }


  return (async () => {
    const user = await User.findById(id)

    if (!user) throw new NotFoundError(`user with id ${id} not found`)
    
    if((password || verifiedPassword) && (password !== verifiedPassword)) throw new ConflictError (`failed to modify password, passwords are not the same, please introduce correctly your password and it's verification`)

    const update = {}

    email && (update.email = email) 
    
    if (password) {
      const hash = await bcrypt.hash(password, 10)
      update.password = hash
    }
    
    update.lastAccess = new Date

    await User.updateOne({ _id: ObjectId(id) }, { $set: update })

    user.save()
    
  })()
}