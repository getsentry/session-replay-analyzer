import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/healthcheck', (req, res) => {
  res.status(200).send('OK')
})

app.post('/api/:version/analyze/accessibility', (req, res) => {
  console.log(req.body)
  res.status(201).send('OK')
})

export { app }
