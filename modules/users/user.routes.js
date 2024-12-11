const app = require('express').Router()
const {createUser , checkVerification , login} = require('./controllers/user.controller')

app.post('/createUser' , createUser)
app.post('/checkVerification/:id' , checkVerification)
app.post('/login' , login)

module.exports = app;