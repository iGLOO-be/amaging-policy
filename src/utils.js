
const moment = require('moment')
const crypto = require('crypto')
const _ = require('lodash')

const utils = {
  genToken(str, secret) {
    const sign = crypto.createHmac('sha1', secret)
    sign.update(str)
    return sign.digest('hex').toLowerCase()
  },

  parseJSON(str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return null
    }
  },

  decodeBase64(str) {
    return new Buffer(str, 'base64').toString()
  },

  offsetDate: (function() {
    const exts = {
      'm': 'minutes',
      'h': 'hours',
      'd': 'days',
      'w': 'weeks',
      'M': 'months',
      'y': 'year'
    }

    const ops = {
      '+': 'add',
      '-': 'substract'
    }

    const join = obj => _.keys(obj).map(v => quoteRegex(v)).join('|')

    var quoteRegex = str => (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")

    const regex = new RegExp(`(${join(ops)})?(\\d+)(${join(exts)})`)
    const regexGlobal = new RegExp(regex.source, 'g')

    return function(date, diff) {
      if (_.isString(date)) {
        diff = date
        date = new Date()
      }

      if (!diff) { return date }

      const parsed = diff.match(regexGlobal)

      if (!parsed) { return date }

      date = moment(date)

      for (let parse of Array.from(parsed)) {
        const single = parse.match(regex)
        if (!single) { break }

        const operator = ops[single[1] || '+']
        const number = single[2]
        const ext = exts[single[3]]

        date[operator](number, ext)
      }

      return date.toDate()
    }
  })()
}

module.exports = utils
