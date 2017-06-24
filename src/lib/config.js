const fs = require('fs')
const fse = require('fs-extra')
const promisifyAll = require('functional-helpers/promisifyAll')
const yaml = require('js-yaml')
const os = require('os')
const path = require('path')
const always = require('ramda/src/always')
const pipeP = require('ramda/src/pipeP')

const fsAsync = promisifyAll(fs)
const configPath = path.join(os.homedir(), '.mojo-cli')
const configFilePath = path.join(os.homedir(), '.mojo-cli/config.yml')

const readYaml =
    pipeP(fsAsync.readFile, yaml.safeLoad)

const writeYaml = (file, object) =>
    fse.ensureDir(configPath)
        .then(() => fsAsync.writeFile(file, yaml.safeDump(object)))

module.exports.readConfig = () =>
    readYaml(configFilePath)
        .catch(always({}))

module.exports.writeConfig = config =>
    writeYaml(configFilePath, config)
