
assert = require 'assert'
_ = require 'lodash'
Store = require 'dottystore'
validators = require './validators'

###
  Policy sample:

  { "expiration": "2007-12-01T12:00:00.000Z",
    "conditions": [
      ["starts-with", "$key", "user/eric/"],
      ["range-length", "$key", 10, 50],
      {"success_action_redirect": "http://johnsmith.s3.amazonaws.com/new_post.html"},
    ]
  }

###

class PolicyError extends Error
  constructor: (@message) ->
    @name = 'PolicyError'
    super

class Condition
  constructor: (@key, @validator, @validatorArgs) ->
  valid: (value) -> @validator.apply(null, [value].concat(_.toArray(@validatorArgs)))

class Policy extends Store
  @validators: {}
  @registerValidators: (validators) ->
    for validatorName of validators
      Policy.registerValidator validatorName, validators[validatorName]
  @registerValidator: (validatorName, validator) ->
    Policy.validators[validatorName] = validator
  @getValidator: (validatorName) ->
    Policy.validators[validatorName]

  constructor: (policy) ->
    super

    @_parsePolicy(policy)

  set: (key, value) ->
    conditions = @_findCondition(key)

    for cond in conditions or []
      unless cond.valid(value)
        throw new PolicyError('Invalid value for key: ' + key)

    super

  _parsePolicy: (policy) ->
    data = {}
    conditions = []

    for pol in policy.conditions or []
      if _.isArray(pol)
        validatorName = pol[0]
        key = pol[1].replace /^$/, ''
        validatorArgs = pol[2...]

        validator = Policy.getValidator(validatorName)
        unless validator
          throw new PolicyError('invalid policy validator name: ' + validatorName)

        condition = new Condition(key, validator, validatorArgs)
        conditions.push condition
      else if _.isObject(pol)
        _.extend data, pol

    @conditions = conditions

    for key of data
      @set key, data[key]

  _findCondition: (key) ->
    _.filter(@conditions, key: key)



Policy.registerValidators validators

module.exports = Policy
