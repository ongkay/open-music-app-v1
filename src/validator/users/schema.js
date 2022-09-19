const Joi = require('joi')

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(4).max(50).required(),
  password: Joi.string().min(6).max(50).required(),
  fullname: Joi.string().min(4).max(50).required(),
})

module.exports = { UserPayloadSchema }
