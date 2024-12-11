const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./DB/DB.connection')
const userRoutes = require('./modules/users/user.routes')
const textRoutes = require('./modules/texts/texts.routes')

dotenv.config();
connectDB()

const app = express();


app.use(cors())
app.use(express.json())
app.use(userRoutes , textRoutes)


const port = process.env.PORT;

app.listen(port , ()=>{
    console.log('server is running');
})