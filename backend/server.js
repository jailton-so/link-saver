require('dotenv').config()
const path = require('path')
const express = require('express')
const webRouter = require('./routes/webRouter')
const apiRouter = require('./routes/apiRouter')
const dbConnection = require('./database')

const app = express()
const PORT = process.env.SERVER_PORT || 3000

app.use(express.json())
app.use('/', webRouter)
app.use('/api', apiRouter)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')))

app.listen(PORT, () => {
    console.log('App listening on port '+PORT)
})

//const version = dbConnection`select version()`.then(result => console.log(result))