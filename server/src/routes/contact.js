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
    filename: async (req, file, cb) => {
      // Define your custom filename logic here
       const originalFileName = file.originalname;
    const filePath = path.join('uploads', originalFileName);
   if(req.params.id){
    cb(null, originalFileName);
   }
   else{

   
    // Check if a file with the same name already exists
    if (fs.existsSync(filePath)) {
      let fileIndex = 1;
      let file = originalFileName.split(".")
      // Generate a new filename with a (1) suffix
      while (fs.existsSync(path.join('uploads', `${file[0]}(${fileIndex}).xlsx`))) {
        fileIndex++;
      }

      const uniqueFileName = `${file[0]}(${fileIndex}).xlsx`;
      cb(null, uniqueFileName);
    } else {
      // File with the same name doesn't exist, use the original filename
      cb(null, originalFileName);
    }
  }
    },
  });
  


  const upload = multer({ storage });

  // cret

// Create a Mongoose model
const Contacts = mongoose.model('Contacts', new mongoose.Schema({ filePath: String },{
  timestamps: true, // Add timestamps (createdAt and updatedAt)
}));

router.post('/save', upload.single('file'), async (req, res) => {
    console.log("hello")
  try {
    // Check if a file was uploaded
    if (!req.file) {
    
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save the file path to the database
    // console.log("hi1111",req.file)
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
      // console.log(fileData)
  
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


  router.post('/saveFile/:id', upload.single('file'), async (req, res) => {
    // console.log("hello")
  try {
    // Check if a file was uploaded
    if (!req.file) {
    
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save the file path to the database
    // console.log("hi1111",req.file)
    const data = { filePath: req.file.path };
    const savedData = await Contacts.updateOne(
      { _id: (req.params.id) },
      { $set: { } }
   )

    res.status(200).json(savedData);
  } catch (err) {
    console.error("hi",err);
    res.status(500).send({ error: 'An error occurred while saving data' });
  }
});

router.get('/delete/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    
    console.log(fileId)
    // Find the file record by ID
    const fileData = await Contacts.findById(fileId);

    if (!fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file record from the database
    await Contacts.deleteOne({ _id: fileId });

    // Remove the file from the 'uploads/' folder
    const filePath = path.join(__dirname, '..','..', fileData.filePath);
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the file' });
  }
});


router.post('/edit/:fileId', async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const newFileName = req.body.newFileName;

    // Find the file record by ID
    const fileData = await Contacts.findById(fileId);

    if (!fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get the current file path
    const currentFilePath = fileData.filePath;

    // Construct the new file path based on the new filename
    const newFilePath = path.join('uploads', newFileName);

    // Check if the new file path already exists
    if (fs.existsSync(newFilePath)) {
      return res.status(400).json({ error: 'File with the new name already exists' });
    }

    // Rename the file in the 'uploads/' folder
    fs.renameSync(currentFilePath, newFilePath);

    // Update the database record with the new file path
    fileData.filePath = 'uploads/'+newFileName;
    await fileData.save();

    res.status(200).json({ message: 'File name updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the file name' });
  }
});





  
module.exports = router;
