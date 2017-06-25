const axios = require('axios')
const config = require('config')
const prop = require('ramda/src/prop')
const querystring = require('querystring')
const errorResponse = require('./lib/errorResponse')

const authUri = config.get('authorizationEndpoint')

const getLoginUrl = realm =>
    `${authUri}/${realm}/oidc/token`

module.exports = model => {
    const request = querystring.stringify(Object.assign({ grant_type: 'refresh_token' }, model))

    return axios.post(getLoginUrl(model.realm), request)
        .then(prop('data'))
        .catch(response => Promise.reject(errorResponse(response)))
}