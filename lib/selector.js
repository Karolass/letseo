const cheerio = require('cheerio')

module.exports.selector = function (buffer, rules, options) {
  rules.forEach(function (rule) {
    if (!rule.tag) return

    if (!rule.attr && !rule.limit) {
      searchExist(buffer, rule)
    } else if (rule.attr && rule.attr.name && !rule.attr.value) {
      searchAttrWithout(buffer, rule)
    } else if (rule.attr && rule.attr.name && rule.attr.value) {
      searchAttrValueExist(buffer, rule)
    } else if (rule.limit && rule.limit.type && rule.limit.count) {
      searchLimit(buffer, rule)
    }
  })
}

const searchAttrWithout = function (html, rule) {
  const $ = cheerio.load(html)
  const tag = rule.tag, attr = rule.attr.name
  let count = 0
  $(tag).each((i, e) => {
    if (!e.attribs[attr]) count++
  })
  const message = `There are ${count} <${tag}> tag without ${attr} attribute`
  console.log(message)
}

const searchExist = function (html, rule) {
  const $ = cheerio.load(html)
  const { tag } = rule
  if ($(tag).length == 0) {
    const message = `This HTML without <${tag}> tag`
    console.log(message)
  }
}

const searchAttrValueExist = function (html, rule) {
  const $ = cheerio.load(html)
  const tag = rule.tag, attr = rule.attr.name, value = rule.attr.value
  if ($(`${tag}[${attr}=${value}]`).length == 0) {
    const message = `This HTML without <${tag} ${attr}="${value}" ...> tag`
    console.log(message)
  }
}

const searchLimit = function (html, rule) {
  const $ = cheerio.load(html)
  const tag = rule.tag, isUpper = rule.limit.type == 'upper' ? true : false, count = rule.limit.count
  if (isUpper && $(tag).length > count) {
    const message = `This HTML more than ${count} <${tag}> tag`
    console.log(message)
  } else if (!isUpper && $(tag).length < count) {
    const message = `This HTML less than ${count} <${tag}> tag`
    console.log(message)
  }
}
