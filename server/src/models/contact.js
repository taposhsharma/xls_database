const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({


    name:{
        type:String,
        required:true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
        required: true,
        
    },


}
)


const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;