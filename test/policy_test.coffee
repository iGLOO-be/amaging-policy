
chai = require 'chai'
assert = chai.assert
expect = chai.expect
chai.should()
chai.use(require('chai-fs'))

requireTest = (path) ->
  require((process.env.APP_SRV_COVERAGE || '../') + path)

requirePolicy = -> requireTest('lib/policy')

describe 'Policy', ->
  it 'is a class', ->
    expect(requirePolicy()).to.be.a('function')

