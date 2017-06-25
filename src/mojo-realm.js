const chalk = require('chalk')
const jwt = require('jsonwebtoken')
const api = require('./lib/mojo-api')
const ensureLogin = require('./lib/ensureLogin')

module.exports = program =>
    program
        .command('realm <action> <realm>')
        .description('list, add or remove realms')
        .action((action, realm) => {
            ensureLogin()
                .then(tokens => {
                    const decoded = jwt.decode(tokens.access_token)
                    return api.createRealm({ realm: `${decoded.sub}:${realm}`, access_token: tokens.access_token })
                })
                .then(() => console.log(`Successfully created ${chalk.cyan(realm)}.`))
                .catch(err => console.log(chalk.red('Error:', err)))
        })
