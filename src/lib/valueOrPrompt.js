const promptly = require('promptly')

module.exports = (value, prompt, options) =>
    value ? Promise.resolve(value) : promptly.prompt(prompt, options)
