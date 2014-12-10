
chai = require 'chai'
assert = chai.assert
expect = chai.expect
chai.should()

moment = require 'moment'

requireTest = (path) ->
  require((process.env.APP_SRV_COVERAGE || '../') + path)

describe 'Utils', ->
  utils = requireTest './lib/utils'

  describe 'utils.offsetDate', ->
    it 'Can perform simple add', ->
      expect(utils.offsetDate('10d').toString()).to.be.equals(
        moment().add(10, 'day').toDate().toString()
      )
