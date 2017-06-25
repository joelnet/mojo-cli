const axios = require('axios')
const config = require('config')
const prop = require('ramda/src/prop')
const querystring = require('querystring')
const errorResponse = require('./lib/errorResponse')

const authUri = config.get('authorizationEndpoint')

module.exports = model =>
    axios.post(`${authUri}/${model.realm}`, querystring.stringify(model))
        .then(prop('data'))
        .catch(response => Promise.reject(errorResponse(response)))
