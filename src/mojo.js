#!/usr/bin/env node

const program = require('commander')
const generatePrivateKeys = require('./generate-private-keys')

program
    .version('1.0.0')
    .usage('[command] [options]')

program
    .command('keys [dir]')
    .description('Generate public and private keys. Default dir is .secrets')
    .action(generatePrivateKeys)

program.parse(process.argv)

if (!program.args.length) {
    program.help()
}