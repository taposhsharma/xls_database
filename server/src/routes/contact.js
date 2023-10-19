const express = require('express')

const router = express.Router()

const Contact = require('../models/contact')

router.post('/save', async (req,res)=>{
    try{

        const contacts = req.body;

        // Check if the received data is an array
        if (!Array.isArray(contacts)) {
          return res.status(400).send({ msg: 'Invalid data format. Expected an array of contacts.' });
        }
    
        
    
        // Save each contact individually
        const savedContacts = await Contact.insertMany(contacts);
        res.status(200).json(savedContacts);
    }catch(err){
        console.log(err)
        res.status(400).send(err)
        
    }
})



module.exports = router