#!/usr/bin/env node

/* eslint-disable no-console */

const program = require('commander')
const generatePrivateKeys = require('./generate-private-keys')

program
    .version('1.0.0')
    .usage('[command] [options]')

program
    .command('keys [dir]')
    .description('Generate public and private keys. Default dir is .secrets')
    .action(generatePrivateKeys)

program
    .command('*', '', { noHelp: true })
    .action(cmd => console.log(`mojo: command ${cmd} not recognized.`))

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}