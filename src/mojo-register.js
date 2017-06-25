const api = require('./lib/mojo-api')

module.exports = program =>
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
