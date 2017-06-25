const chalk = require('chalk')
const config = require('config')
const api = require('./lib/mojo-api')
const userConfig = require('./lib/config')
const valueOrPrompt = require('./lib/valueOrPrompt')

module.exports = program =>
    program
        .command('login <username>')
        .option('-p <password>', 'Password of mojo.sh account')
        .description('login to your mojo.sh account.\n  -u <username>\n  -p <password>')
        .action((username, opts) =>
            valueOrPrompt(opts.P, 'Password:', { silent: true, replace: '*' })
                .then(password => api.login({ username, password, realm: 'mojo:default', client_id: config.get('client_id') }))
                .then(session =>
                    userConfig.readConfig()
                        .then(config => userConfig.writeConfig(Object.assign({}, config, { username, session })))
                )
                .then(() => console.log(`You are now logged in as ${chalk.cyan(username)}.`))
                .catch(err => console.log(chalk.red('Error:', err)))
        )
