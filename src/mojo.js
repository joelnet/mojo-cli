#!/usr/bin/env node

/* eslint-disable no-console */
const api = require('./lib/mojo-api')

const program = require('commander')
const generatePrivateKeys = require('./generate-private-keys')

program
    .version('1.0.0')
    .usage('[command] [options]')

program
    .command('register')
    .option('-u <username>', 'Username to register')
    .option('-p <password>', 'Password to register')
    .description('register for a mojo.sh account.\n  -u <username>\n  -p <password>\n  -c <client_id>')
    .action(cmd =>
        api.register({ realm: 'mojo:default', client_id: 'mojo-cli', username: cmd.U, password: cmd.P })
            .then(() => console.log(`User ${cmd.U} created.`))
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