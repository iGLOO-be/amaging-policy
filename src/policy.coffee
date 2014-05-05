
class Policy
  contructor: (policy, token) ->
    @policy = policy
    @token = token
    @_isValid()

  _isValid: ->
    console.log 'Policy: ', @policy
    console.log 'Token: ', @token

    newPolicy = new Buffer('toto', 'base64')
    unless newPolicy == @token
      return false
    else
      return true

  get: (key, value) ->



  set: (key) ->


module.exports = Policy
