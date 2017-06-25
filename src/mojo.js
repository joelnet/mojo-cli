#!/usr/bin/env node

const mojoLogin = require('./mojo-login')
const mojoRealm = require('./mojo-realm')
const mojoKeys = require('./mojo-keys')
const mojoRegister = require('./mojo-register')

const actions = [mojoLogin, mojoRealm, mojoRegister, mojoKeys]
const program = require('commander')

program
    .version('1.0.0')
    .usage('[command] [options]')

actions.map(func => func(program))

program
    .command('*', '', { noHelp: true })
    .action(cmd => console.log(`mojo: command ${cmd} not recognized.`))

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}