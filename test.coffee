
# express = require('express')
# app = express()


# app.all('/', (req, res, next) ->
#   next()
# )

# app.listen(7777, (err) ->
#   console.log(err)
#   require('request')('http://localhost:7777', (err, res) ->
#     console.log(err, res)
#   )
# )

request = require 'request'

opt =
  url: 'http://httpbin.org/test/fichier.json'
  headers:
    'x-authentication': 'apiaccess'
    'x-authentication-token': 123

cb = (error, response, body) ->
  console.log 'REQUEST_CODE: ', response
  if !error && response.statusCode == 200
    info = JSON.parse(body)
    console.log 'INFO: ', info
  else
    console.log 'REQUEST_ERROR: ', error

r = request.post opt, cb
form = r.form()
form.append('file', '{"multi":true}', {
  contentType: 'application/json'
})


class UrlRepresentation
  constructor: (url, cid, resource) ->
    @_resource = resource
    @_options = []

  options: (options...) ->
    @_options = @_option.concat options

  toString: ->
    



client = new Client()

client.url('/ma/resource.jpg').toString() == client.urlStr('/ma/resource.jpg')
client
  .url('/ma/resource.jpg')
  .options('100x100')
  .options('negative')
  .toString()


