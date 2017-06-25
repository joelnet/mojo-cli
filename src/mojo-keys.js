const generatePrivateKeys = require('./lib/generate-private-keys')

module.exports = program =>
    program
        .command('keys')
        .option('-d <dir>', 'Directory to install keys', '.secrets')
        .description('Generate public and private keys.\n  -d <dir> (default=.secrets)')
        .action(generatePrivateKeys)
