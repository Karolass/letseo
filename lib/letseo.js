const fs = require('fs')
const Selector = require('./selector')

const defaultRules = {
  img: { tag: 'img', attr: { name: 'alt' }},
  a: { tag: 'a', attr: { name: 'rel' }},
  title: { tag: 'title' },
  descriptions: { tag: 'meta', attr: { name: 'name', value: 'descriptions' }},
  keywords: { tag: 'meta', attr: { name: 'name', value: 'keywords' }},
  strong: { tag: 'strong', limit: { type: 'upper', count: 15 }},
  h1: { tag: 'h1', limit: { type: 'upper', count: 1 }},
}
const rules = []

const checkFileExist = function (filePath) {
  try {
    fs.statSync(filePath)
    return true
  } catch (error) {
    console.error(`[letseo] ${error.message}`)
    return false
  }
}

module.exports = function (options) {
  if (!options) return console.log('[letseo] options is required')

  // deal with default
  if (!options.default) {
    for (let key in defaultRules) {
      rules.push(defaultRules[key])
    }
  } else {
    for (let key in options.default) {
      if (typeof options.default[key] == 'number') defaultRules[key].limit.count = options.default[key]
      if (options.default[key]) rules.push(defaultRules[key])
    }
  }

  // deal with custom rules
  if (Array.isArray(options.rules)) {
    for (let rule of options.rules) {
      rules.push(rule)
    }
  }

  const selector = new Selector(rules, options.print == undefined || options.print)

  if (options.input && checkFileExist(options.input)) {
    const rs = fs.createReadStream(options.input).pipe(selector)
    if (options.output) rs.pipe(fs.createWriteStream(options.output))
  } else {
    return selector
  }
}
