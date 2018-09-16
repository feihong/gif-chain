const express = require('express')
const app = express()
const problems = require('./problems')

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
})

app.get('/problems', (req, res) => {
  res.status(200).json(problems)
})

const listener = app.listen(process.env.PORT || 8000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
})
