#!/usr/bin/env node

const config = require('config')
const os = require('os')
const fs = require('fs')
const path = require('path')
const promisify = require('functional-helpers/promisify')
const api = require('./lib/mojo-api')
const always = require('ramda/src/always')
const yaml = require('js-yaml')
const userConfig = require('./lib/config')
const promptly = require('promptly')
const chalk = require('chalk')

const program = require('commander')
const generatePrivateKeys = require('./generate-private-keys')

const ensureLogin = () =>
    userConfig.readConfig()
        .then(config => config.session)

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
        console.log('realm', action, realm)
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