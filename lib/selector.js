const cheerio = require('cheerio')
const { Transform } = require('stream')
const util = require('util')

const Selector = module.exports = function (rules, print) {
  Transform.call(this)

  this.rules = rules
  this.print = print
  this.buffer
  this.message = ''

  this._transform = function (data, e, callback) {
    // 失去stream的優點 但html檔案不完整會嚴重誤判資料
    this.buffer += data
    callback()
  }

  this._flush = function (callback) {
    this.selector()
    if (this.print) console.log(this.message)
    callback(null, this.message)
  }

  this.selector = function () {
    this.rules.forEach(function (rule) {
      if (!rule.tag) return

      if (!rule.attr && !rule.limit) {
        this.searchExist(rule)
      } else if (rule.attr && rule.attr.name && !rule.attr.value) {
        this.searchAttrWithout(rule)
      } else if (rule.attr && rule.attr.name && rule.attr.value) {
        this.searchAttrValueExist(rule)
      } else if (rule.limit && rule.limit.type && rule.limit.count) {
        this.searchLimit(rule)
      }
    }.bind(this))
  }

  this.searchAttrWithout = function (rule) {
    const $ = cheerio.load(this.buffer)
    const tag = rule.tag, attr = rule.attr.name
    let count = 0
    $(tag).each((i, e) => {
      if (!e.attribs[attr]) count++
    })
    const message = `There are ${count} <${tag}> tag without ${attr} attribute`
    this.message += `${message}\n`
  }

  this.searchExist = function (rule) {
    const $ = cheerio.load(this.buffer)
    const { tag } = rule
    if ($(tag).length == 0) {
      const message = `This HTML without <${tag}> tag`
      this.message += `${message}\n`
    }
  }

  this.searchAttrValueExist = function (rule) {
    const $ = cheerio.load(this.buffer)
    const tag = rule.tag, attr = rule.attr.name, value = rule.attr.value
    if ($(`${tag}[${attr}="${value}"]`).length == 0) {
      const message = `This HTML without <${tag} ${attr}="${value}" ...> tag`
      this.message += `${message}\n`
    }
  }

  this.searchLimit = function (rule) {
    const $ = cheerio.load(this.buffer)
    const tag = rule.tag, isUpper = rule.limit.type == 'upper' ? true : false, count = rule.limit.count
    if (isUpper && $(tag).length > count) {
      const message = `This HTML more than ${count} <${tag}> tag`
      this.message += `${message}\n`
    } else if (!isUpper && $(tag).length < count) {
      const message = `This HTML less than ${count} <${tag}> tag`
      this.message += `${message}\n`
    }
  }
}

util.inherits(Selector, Transform)
