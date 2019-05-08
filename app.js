const express = require('express')
const m = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const Snippet = require('./schemas/snippet')

const PORT = process.env.PORT || 8080
const app = express()
app.use(bodyParser.json())
app.use(cors())

m.connect('mongodb://localhost:27017/snippetsDB', {useNewUrlParser:true}, (error) => {
  if(!error) {
    console.log('Connected to MongoDB.')
  } else {
    console.log(error)
  }
})

let snippetTest = new Snippet({
  title: "Python problems",
  body: "for car in cars",
  tag: "Python"
})

app.get('/api/snippets', (req,res)=> {
  Snippet.find({},(error, snippets) => {
    if(!error) {
      res.json({success:true, message: "Snippets retrieved.", snippets: snippets})
    } else {
      res.json({sucess:false, message: "Failed to retrieve snippets from database.", error: error})
    }
  })
})

app.post('/api/snippets', (req,res) => {
  const title = req.body.title
  const body = req.body.body
  const tag = req.body.tag

  let snippet = new Snippet({
    title: title,
    body: body,
    tag: tag
  })

  snippet.save(error => {
    if(!error) {
      res.json({success: true, message: 'Snippet saved...'})
    } else {
      res.json({success: false, message: 'Unable to save snippet...', error: error})
    }
  })
})

app.put('/api/snippet', (req,res) => {
  const id = req.body.snippetId
  const title = req.body.title
  const body = req.body.body
  const tag = req.body.tag

  const updatedSnippet = {
    title: title,
    body: body,
    tag: tag
  }
  Snippet.findOneAndUpdate({_id: id}, updatedSnippet, (error, snippet) => {
    if(!error) {
      res.json({success: true, message: 'Snippet updated...', snippet: snippet})
    } else {
      res.json({success: false, message: 'Unable to update snippet...', error: error})
    }
  })
})

app.delete('/api/snippet/:snippetId', (req,res) => {
  let id = req.params.snippetId

  Snippet.remove({_id: id}, (error, result) => {
    if(!error) {
      res.json({success: true, message: 'Snippet deleted...', result: result})
    } else {
      res.json({success: false, message: 'Unable to delete snippet...', error: error})
    }
  })

})

app.get('/api/snippet/:snippetTag', (req,res) => {
  const tag = req.params.snippetTag
  Snippet.find({tag:tag}, (error, snippets) => {
    if(!error) {
      res.json({success:true, message: "Snippets retrieved.", snippets: snippets})
    } else {
      res.json({sucess:false, message: "Failed to retrieve snippets from database.", error: error})
    }
  })
})


app.listen(8080, ()=> {
  console.log("Snippets served promptly.")
})
