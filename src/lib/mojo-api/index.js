const axios = require('axios')
const querystring = require('querystring')
const prop = require('ramda/src/prop')
const userRegistrationModel = require('./models/userRegistrationModel')

module.exports.register = model =>
    userRegistrationModel(model)
        .then(model =>
            axios.post(`https://yydpeix3rd.execute-api.us-west-2.amazonaws.com/dev/auth/${model.realm}/registration`, querystring.stringify(model))
                .catch(({ response }) => Promise.reject(response.data))
        )
        .then(prop('data'))
