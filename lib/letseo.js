const fs = require('fs')
const { searchAttrWithout, searchAttrValueExist, searchExist, searchLimit } = require('./selector')

const rules = [
  { tag: 'img', attr: { name: 'alt' }},
  { tag: 'a', attr: { name: 'rel' }},
  { tag: 'title' },
  { tag: 'meta', attr: { name: 'name', value: 'descriptions' }},
  { tag: 'meta', attr: { name: 'name', value: 'keywords' }},
  { tag: 'strong', limit: { type: 'upper', count: 15 }},
  { tag: 'h1', limit: { type: 'upper', count: 1 }},
]

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

  if (!options.rules) options.rules = rules

  if (checkFileExist(options.file)) {
    const file = fs.readFileSync(options.file)

    options.rules.forEach(function (rule) {
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
