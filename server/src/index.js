const express = require('express')

const cors = require('cors')

require('./db/mongoose')
const app = express()

app.use(cors())
app.use(express.json())


const PORT = 3000

app.use('/contact', require('./routes/contact'))

app.listen(PORT, ()=>{
    console.log(`App is running on port ${PORT}`)
})