#!/usr/bin/env node

const config = require('config')
const api = require('./lib/mojo-api')
const userConfig = require('./lib/config')
const promptly = require('promptly')
const chalk = require('chalk')
const propOr = require('ramda/src/propOr')
const jwt = require('jsonwebtoken')

const program = require('commander')
const generatePrivateKeys = require('./generate-private-keys')

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

const ensureLogin = () =>
    userConfig.readConfig()
        .then(propOr({}, 'session'))
        .then(rejectIfNoRefreshToken)
        .then(rejectIfRefreshTokenExpired)
        .then(session => api.refreshToken({ refresh_token: session.refresh_token, realm: 'mojo:default', client_id: config.get('client_id') }))
        .then(saveSession)

const valueOrPrompt = (value, prompt, options) =>
    value ? Promise.resolve(value) : promptly.prompt(prompt, options)

program
    .version('1.0.0')
    .usage('[command] [options]')

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

program
    .command('register')
    .option('-u <username>', 'Username to register')
    .option('-e <email>', 'Email to register')
    .option('-p <password>', 'Password to register')
    .description('register for a mojo.sh account.\n  -u <username>\n  -p <password>\n  -c <client_id>')
    .action(opts =>
        api.register({ realm: 'mojo:default', client_id: 'mojo-cli', username: opts.U, email: opts.E, password: opts.P })
            .then(() => console.log(`User ${opts.U} created.`))
            .catch(err => console.log('Registration failed:', err))
    )

program
    .command('keys')
    .option('-d <dir>', 'Directory to install keys', '.secrets')
    .description('Generate public and private keys.\n  -d <dir> (default=.secrets)')
    .action(generatePrivateKeys)

program
    .command('*', '', { noHelp: true })
    .action(cmd => console.log(`mojo: command ${cmd} not recognized.`))

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}