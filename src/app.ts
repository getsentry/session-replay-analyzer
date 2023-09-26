import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/healthcheck', (req, res) => {
  res.status(200).send('OK')
})

app.get('/api/:version/analyze/accessibility', (req, res) => {
  res.status(201).send('OK')
})

export { app }
