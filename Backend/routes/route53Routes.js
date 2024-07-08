const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const router = express.Router();

const route53Service = require('../services/route53Service');
const { login } = require('../controllers/authController');

// Middleware for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Authentication
router.post('/login', login);

// Get Hosted Zones
router.get('/zones', async (req, res) => {
  try {
    const hostedZones = await route53Service.getHostedZones();
    res.json(hostedZones);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get records of a hosted zone by ID
router.get('/zones/hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const records = await route53Service.getRecords(id);
    res.json(records);
  } catch (error) {
    console.error('Error fetching records for hosted zone: ${id}', error);
    res.status(500).send(error.message);
  }
});

// Create DNS Record
router.post('/zones/hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const recordData = req.body;
    const result = await route53Service.createRecord(id, recordData);
    res.json(result);
  } catch (error) {
    console.log('error while creating record');
    res.status(500).send(error.message);
  }
});

// Update DNS Record
router.put('/zones/hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const recordData = req.body;
    const result = await route53Service.updateRecord(id, recordData);
    res.json(result);
  } catch (error) {
    console.log('error while updating record');
    res.status(500).send(error.message);
  }
});

// Delete DNS Record
router.delete('/zones/hostedzone/:id/records', async (req, res) => {
  try {
    const { id } = req.params;
    const recordData = req.body;
    const result = await route53Service.deleteRecord(id, recordData);
    res.json(result);
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).send(error.message);
  }
});

// Bulk Upload DNS Records
router.post('/zones/hostedzone/:id/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;
    const filePath = file.path;
    
    // Determine if the file is a CSV based on mimetype or file extension
    const fileType = file.mimetype ;
    const records = await parseFile(filePath, fileType);

    for (const record of records) {
      if (record.Action === 'CREATE') {
        await route53Service.createRecord(id, record);
      } else if (record.Action === 'UPDATE') {
        await route53Service.updateRecord(id, record);
      } else if (record.Action === 'DELETE') {
        await route53Service.deleteRecord(id, record);
      }
    }
    res.json({ message: 'Bulk upload processed successfully' });
  } catch (error) {
    console.error('Error processing bulk upload:', error); 
    res.status(500).send(error.message);
  }
});

const parseFile = (filePath, fileType) => {
  return new Promise((resolve, reject) => {
    const records = [];
   
    if (fileType === 'text/csv') {
      console.log('Parsing CSV file:', filePath);
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const record = {
            Action: row.Action,
            Name: row.Name,
            Type: row.Type,
            TTL: parseInt(row.TTL), // Ensure TTL is parsed as integer
            ResourceRecords: JSON.parse(row.ResourceRecords)
          };
          records.push(record);
        })
        .on('end', () => {
          console.log('CSV parsing completed.');
          resolve(records);
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    } else if(fileType=== 'application/json') {
      console.log('Parsing JSON file:');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading JSON file:', err);
          reject(err);
          return;
        }
        try {
          const json = JSON.parse(data);
          console.log('JSON data:', json);
          resolve(json);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          reject(error);
        }
      });
    }
    else{
      console.error('Error cannot read other type than json and csv');
    }
  });
};


module.exports = router;