
module.exports =
  'eq': (value, expected) ->
    return value == expected

  'starts-with': (value, expected) ->
    return value.substr(0, expected.length) == expected
