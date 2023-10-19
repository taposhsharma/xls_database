const mongoose = require('mongoose')

const uri = 'mongodb+srv://tsharma:1234567890@cluster0.zsqimom.mongodb.net/xls_data?retryWrites=true&w=majority'
 
mongoose.connect(uri)
    .then(client => {
        console.log('connected sucessfully')
    })
    .catch(err=>{ 
        console.log(err)
    })