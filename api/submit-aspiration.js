// api/submit-aspiration.js
const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, aspiration } = req.body;

  console.log('Data diterima:', { name, email, aspiration });

  if (!aspiration) {
    return res.status(400).json({ error: 'Aspirasi wajib diisi' });
  }

  const dataDir = path.join('/tmp', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dataFilePath = path.join(dataDir, 'aspirations.json');
  const newAspiration = {
    name: name || 'Anonim',
    email: email || 'Tidak ada',
    aspiration: aspiration,
    timestamp: new Date().toISOString()
  };

  try {
    const aspirations = fs.existsSync(dataFilePath) ? JSON.parse(fs.readFileSync(dataFilePath)) : [];
    aspirations.push(newAspiration);
    fs.writeFileSync(dataFilePath, JSON.stringify(aspirations, null, 2));
    console.log('Data disimpan ke:', dataFilePath, 'Isi:', newAspiration);
    res.status(200).json({ message: 'Aspirasi berhasil disimpan!' });
  } catch (error) {
    console.error('Error menyimpan data:', error.message, 'Stack:', error.stack);
    res.status(500).json({ error: 'Gagal menyimpan aspirasi: ' + error.message });
  }
}