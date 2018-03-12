const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const models = require('./models')
const wikiRoutes = require('./routes/wiki')
const userRoutes = require('./routes/user')

const app = express()
const PORT = 3000

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extended: false}))

app.use('/wiki', wikiRoutes)
app.use('/users', userRoutes)

app.use('/', (req, res, next) => {
  res.redirect('/wiki')
})

const initialize = async () => {
  try {
    await models.db.authenticate()
    await models.db.sync()
    console.log('connected to the database')

    app.listen(PORT, () => {
      console.log(`Listening on Port ${PORT}`)
    })
  } catch (err) {
    console.log('Fatal Error: Cannot connect to database.', err)
  }
}

initialize()
