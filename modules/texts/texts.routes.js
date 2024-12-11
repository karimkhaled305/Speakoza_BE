const app = require('express').Router()
const authenticateUser = require('../../middleware/authenticateUser')
const {generateAudio,getAudioFile , getUserAudios , deleteAudio} = require('./controllers/texts.controller');


app.post('/generate' , authenticateUser ,generateAudio)
app.get('/getAudio/:id',authenticateUser , getAudioFile)
app.get('/getUserAudios' , authenticateUser , getUserAudios)
app.delete('/deleteAudio' , deleteAudio)



module.exports = app;