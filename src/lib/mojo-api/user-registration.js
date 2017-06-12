const axios = require('axios')
const config = require('config')
const querystring = require('querystring')
const prop = require('ramda/src/prop')
const userRegistrationModel = require('./models/userRegistrationModel')

const authUri = config.get('authorizationEndpoint')

const getRegistrationUrl = realm =>
    `${authUri}/${realm}/registration`

module.exports = model =>
    userRegistrationModel(model)
        .then(model => axios.post(getRegistrationUrl(model.realm), querystring.stringify(model)))
        .then(prop('data'))
        .catch(({ response }) => Promise.reject(response.data))
