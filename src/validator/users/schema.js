const Joi = require('joi')

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().min(4).required(),
})

module.exports = { UserPayloadSchema }
