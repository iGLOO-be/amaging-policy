
module.exports =
  'eq': (value, expected) ->
    return value == expected

  'starts-with': (value, expected) ->
    return false if typeof value?.substr != 'function' or !expected?.length
    return value.substr(0, expected.length) == expected

  'ends-with': (value, expected) ->
    return false if typeof value?.indexOf != 'function' or !expected?.length
    return value.indexOf(expected, value.length - expected.length) != -1

  'regex': (value, mask) ->
    return false unless value and mask
    regex = new RegExp mask
    regex.test value

  'in': (value, possibleValues) ->
    possibleValues?.indexOf?(value) >= 0
