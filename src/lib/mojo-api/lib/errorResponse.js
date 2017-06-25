const pathOr = require('ramda/src/pathOr')

module.exports = response =>
    typeof response === 'string'
        ? response
        : pathOr(response.response.data, ['response', 'data', 'error'], response)
