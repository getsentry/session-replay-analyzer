import express from 'express'
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/healthcheck', (req, res) => {
  res.status(200).send('OK')
})

// app.listen(port, () => {
//   console.log(`Running forever at http://localhost:${port}`)
// })

export { app }
