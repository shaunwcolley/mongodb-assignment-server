const m = require('mongoose')

const snippetSchema = new m.Schema({
  title: String,
  body: String,
  tag: String
})

const Snippet = m.model('Snippet', snippetSchema)

module.exports = Snippet
