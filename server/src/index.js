const express = require('express')

const cors = require('cors')

require('./db/mongoose')
const app = express()

app.use(express.json({ limit: '50mb' }));


app.use(cors())
app.use(express.json())


const PORT = 3001

app.use('/contact', require('./routes/contact'))

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})