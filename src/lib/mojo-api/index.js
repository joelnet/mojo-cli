const userRegistration = require('./user-registration')
const userLogin = require('./user-login')
const refreshToken = require('./refresh-token')
const createRealm = require('./realm-create')

module.exports = {
    login: userLogin,
    register: userRegistration,
    refreshToken,
    createRealm,
}
