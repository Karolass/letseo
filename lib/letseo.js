const fs = require('fs')
const { searchAttrWithout, searchAttrValueExist, searchExist, searchLimit } = require('./selector')

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
    console.error(error.message)
    return false
  }
}

module.exports = function (options) {
  if (!options.file) return console.error('Key `file` is required.')

  if (!options.default) {
    for (let key in defaultRules) {
      rules.push(defaultRules[key])
    }
  } else {
    for (let key in options.default) {
      if (key == 'strong' && typeof options.default[key] == 'number') defaultRules[key].limit.count = options.default[key]
      if (options.default[key]) rules.push(defaultRules[key])
    }
  }

  if (checkFileExist(options.file)) {
    const file = fs.readFileSync(options.file)

    rules.forEach(function (rule) {
      if (!rule.tag) return

      if (!rule.attr && !rule.limit) {
        searchExist(file, rule.tag)
      } else if (rule.attr && rule.attr.name && !rule.attr.value) {
        searchAttrWithout(file, rule.tag, rule.attr.name)
      } else if (rule.attr && rule.attr.name && rule.attr.value) {
        searchAttrValueExist(file, rule.tag, rule.attr.name, rule.attr.value)
      } else if (rule.limit && rule.limit.type && rule.limit.count) {
        searchLimit(file, rule.tag, rule.limit.type == 'upper' ? true : false, rule.limit.count)
      }
    })
  }
}
