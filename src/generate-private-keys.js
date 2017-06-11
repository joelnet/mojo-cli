const keypair = require('keypair')
const fs = require('fs')

const defaultPath = '.secrets'

module.exports = cmd => {
    const pair = keypair()

    const path = cmd.D || defaultPath

    fs.existsSync(path) || fs.mkdirSync(path)
    fs.writeFileSync(`${path}/public.key`, pair.public)
    fs.writeFileSync(`${path}/private.key`, pair.private)

    console.log(`RSA Keys were successfully created in ${path}.`) // eslint-disable-line no-console
}
