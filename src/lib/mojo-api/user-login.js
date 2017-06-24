const axios = require('axios')
const config = require('config')
const pathOr = require('ramda/src/pathOr')
const prop = require('ramda/src/prop')
const querystring = require('querystring')

const authUri = config.get('authorizationEndpoint')

const getLoginUrl = realm =>
    `${authUri}/${realm}/oidc/token`

const errorResponse = response =>
    typeof response === 'string'
        ? response
        : pathOr(response.response.data, ['response', 'data', 'error'], response)

module.exports = model => {
    const request = querystring.stringify(Object.assign({ grant_type: 'password' }, model))

    return axios.post(getLoginUrl(model.realm), request)
        .then(prop('data'))
        .catch(response => Promise.reject(errorResponse(response)))
}