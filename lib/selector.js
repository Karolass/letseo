const cheerio = require('cheerio')

module.exports.searchAttrWithout = function (html, tag, attr) {
  const $ = cheerio.load(html)
  let count = 0
  $(tag).each((i, e) => {
    if (!e.attribs[attr]) count++
  })
  console.log(`There are ${count} <${tag}> tag without ${attr} attribute`)
}

module.exports.searchExist = function (html, tag) {
  const $ = cheerio.load(html)
  if ($(tag).length == 0) console.log(`This HTML without <${tag}> tag`)
}

module.exports.searchAttrValueExist = function (html, tag, attr, value) {
  const $ = cheerio.load(html)
  if ($(`${tag}[${attr}=${value}]`).length == 0) console.log(`This HTML without <${tag} ${attr}="${value}" ...> tag`)
}

module.exports.searchLimit = function (html, tag, isUpper, count) {
  const $ = cheerio.load(html)
  if (isUpper && $(tag).length > count) console.log(`This HTML more than ${count} <${tag}> tag`)
  if (!isUpper && $(tag).length < count) console.log(`This HTML less than ${count} <${tag}> tag`)
}

module.exports.searchH1 = function (html) {
  const $ = cheerio.load(html)
  if ($('h1').length > 1) console.log(`This HTML more than 1 <h1> tag`)
}