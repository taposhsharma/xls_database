const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Define the directory where files will be stored
    },
    filename: (req, file, cb) => {
      // Define your custom filename logic here
      const customFileName = `${file.originalname}`;
      cb(null, customFileName);
    },
  });
  
  const upload = multer({ storage });
  // cret

// Create a Mongoose model
const Contacts = mongoose.model('Contacts', new mongoose.Schema({ filePath: String }));

router.post('/save', upload.single('file'), async (req, res) => {
    console.log("hello")
  try {
    // Check if a file was uploaded
    if (!req.file) {
    
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save the file path to the database
    console.log("hi1111",req.file)
    const data = { filePath: req.file.path };
    const savedData = await Contacts.create(data);

    res.status(200).json(savedData);
  } catch (err) {
    console.error("hi",err);
    res.status(500).send({ error: 'An error occurred while saving data' });
  }
});

router.get('/allData', async (req, res) => {
    try {
      // Query the database to retrieve all the file paths
      const files = await Contacts.find();
  
      if (!files) {
        return res.status(404).json({ error: 'No files found' });
      }
  
       

    res.status(200).send(files);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while fetching files' });
    }
  });
  

  router.get('/download/:fileId', async (req, res) => {
    try {
      const fileId = req.params.fileId;
  
    
      const fileData = await Contacts.findById(fileId);
      console.log(fileData)
  
      if (!fileData) {
        return res.status(404).json({ error: 'File not found' });
      }
      res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      
      res.status(200);
      const filePath = path.join(__dirname, '..', '..', fileData.filePath);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while serving the file' });
    }
  });

module.exports = router;
