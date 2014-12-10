
moment = require 'moment'
crypto = require 'crypto'
_ = require 'lodash'

utils =
  genToken: (str, secret) ->
    sign = crypto.createHmac('sha1', secret)
    sign.update(str)
    return sign.digest('hex').toLowerCase()

  parseJSON: (str) ->
    try
      return JSON.parse(str)
    catch e
      return null

  decodeBase64: (str) ->
    return new Buffer(str, 'base64').toString()

  offsetDate: do ->
    exts =
      'm': 'minutes'
      'h': 'hours'
      'd': 'days'
      'w': 'weeks'
      'M': 'months'
      'y': 'year'

    ops =
      '+': 'add'
      '-': 'substract'

    join = (obj) ->
      _.keys(obj).map((v) -> quoteRegex(v)).join('|')

    quoteRegex = (str) ->
      return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")

    regex = new RegExp("(#{join(ops)})?(\\d+)(#{join(exts)})")
    regexGlobal = new RegExp(regex.source, 'g')

    return (date, diff) ->
      if _.isString(date)
        diff = date
        date = new Date()

      return date unless diff

      parsed = diff.match(regexGlobal)

      return date unless parsed

      date = moment(date)

      for parse in parsed
        single = parse.match(regex)
        break unless single

        operator = ops[single[1] or '+']
        number = single[2]
        ext = exts[single[3]]

        date[operator](number, ext)

      return date.toDate()

module.exports = utils