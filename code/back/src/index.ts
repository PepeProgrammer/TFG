import express from 'express'
import cors from 'cors'
import { testConection } from './models/db'
import animalRouter from './routes/animals'
import filterRouter from './routes/filters'

const app = express()

const PORT = 3000

app.get('/', (_req, res) => {
  res.send('funciona')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

testConection().then(() => {
  console.log('finish test')
}).catch(() => {
  console.log('error test')
})
app.use(cors())
app.use('/api/animals', animalRouter)
app.use('/api/filters', filterRouter)
