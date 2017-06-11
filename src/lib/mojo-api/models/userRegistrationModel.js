const promisify = require('functional-helpers/promisify')
const Joi = require('joi')
const validate = promisify(Joi.validate)

const schema = Joi.object().keys({
    realm: Joi.string().required(),
    client_id: Joi.string().required(),
    username: Joi.string().email().required(),
    password: Joi.string().required(),
    redirect_uri: Joi.string()
})

module.exports = model =>
    validate(model, schema)
        .catch(err => Promise.reject(err.details[0].message))
