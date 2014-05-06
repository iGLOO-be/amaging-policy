
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

module.exports = utils