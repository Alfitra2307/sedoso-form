const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Path untuk file penyimpanan
const dataFilePath = path.join(__dirname, 'data', 'aspirations.json');

// Membaca data dari file
const readData = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath);
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error membaca file:', error);
    return [];
  }
};

// Menyimpan data ke file
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error menyimpan file:', error);
    throw new Error('Gagal menyimpan data');
  }
};

// Endpoint untuk menerima aspirasi
app.post('/submit-aspiration', (req, res) => {
  console.log('Menerima data:', req.body);
  const { name, email, aspiration } = req.body;

  if (!aspiration) {
    return res.status(400).json({ error: 'Aspirasi wajib diisi' });
  }

  const newAspiration = {
    name: name || 'Anonim',
    email: email || 'Tidak ada',
    aspiration: aspiration,
    timestamp: new Date().toISOString()
  };

  try {
    const aspirations = readData();
    aspirations.push(newAspiration);
    writeData(aspirations);
    console.log('Data disimpan:', newAspiration);
    res.status(200).json({ message: 'Aspirasi berhasil disimpan!' });
  } catch (error) {
    console.error('Error menyimpan data:', error);
    res.status(500).json({ error: 'Gagal menyimpan aspirasi' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});