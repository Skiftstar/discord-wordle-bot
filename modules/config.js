const fs = require('fs')
const path = require('path')

const CONFIG_FILE = path.join(__dirname, './../config.json')
const config = JSON.parse(fs.readFileSync(CONFIG_FILE))

const getConfigValue = (key) => {
  return config[key]
}

module.exports = { getConfigValue }
