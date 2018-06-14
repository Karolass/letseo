const { Transform } = require('stream')
const util = require('util')

const Printer = module.exports = function (print) {
  Transform.call(this)

  this.print = print

  this._transform = function (data, e, callback) {
    if (this.print) console.log(data.toString('utf8'))
    callback(null, data)
  }
}

// 繼承 Transform
util.inherits(Printer, Transform)
