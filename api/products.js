const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'products.json');

module.exports = (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
};