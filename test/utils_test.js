/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const path = require('path')
const chai = require('chai')
const { expect } = chai
chai.should()

const moment = require('moment')

const requireTest = mod => require(path.join((process.env.APP_SRV_COVERAGE || '../lib'), mod))

describe('Utils', function () {
  const utils = requireTest('./utils')

  describe('utils.offsetDate', () =>
    it('Can perform simple add', () =>
      expect(utils.offsetDate('10d').toString()).to.be.equals(
        moment().add(10, 'day').toDate().toString()
      )
    )
  )
})
