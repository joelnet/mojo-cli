const config = require('config')
const jwt = require('jsonwebtoken')
const propOr = require('ramda/src/propOr')
const userConfig = require('./config')
const api = require('./mojo-api')

const rejectIfNoRefreshToken = session =>
    session.refresh_token
        ? session
        : Promise.reject('You must login to perform this action.')

const rejectIfRefreshTokenExpired = session =>
    jwt.decode(session.refresh_token).exp - Math.floor(Date.now() / 1000) >= 0
        ? session
        : Promise.reject('Your login session has expired. Please login to perform this action.')

const saveSession = session =>
    userConfig.readConfig()
        .then(config => userConfig.writeConfig(Object.assign({}, config, { session })))
        .then(() => session)

module.exports = () =>
    userConfig.readConfig()
        .then(propOr({}, 'session'))
        .then(rejectIfNoRefreshToken)
        .then(rejectIfRefreshTokenExpired)
        .then(session => api.refreshToken({ refresh_token: session.refresh_token, realm: 'mojo:default', client_id: config.get('client_id') }))
        .then(saveSession)
