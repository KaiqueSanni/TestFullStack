const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');

const app = express();
const port = 3000;

// Create a storage engine for multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Data structure to store CSV data in memory
let csvData = [];

// Middleware to parse JSON body
app.use(express.json());

// Endpoint to accept CSV file upload
app.post('/api/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Parse the uploaded CSV file
  const fileBuffer = req.file.buffer.toString();
  csvParser()
    .on('data', (data) => csvData.push(data))
    .on('end', () => {
      res.status(200).json({ message: 'File uploaded successfully' });
    })
    .write(fileBuffer);
});

// Endpoint to search through loaded CSV data
app.get('/api/users', (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term not provided' });
  }

  // Case-insensitive and partial matching search
  const results = csvData.filter((row) => {
    return Object.values(row).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  res.status(200).json(results);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
