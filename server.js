const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'vtm666';
const DATA_FILE = path.join(__dirname, 'public', 'data', 'products.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'public', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize products.json if not exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Helper: Calculate volume per carton (CBM)
function calculateVolumePerCtn(length_m, width_m, height_m) {
  if (length_m > 0 && width_m > 0 && height_m > 0) {
    return length_m * width_m * height_m;
  }
  return 0;
}

// Helper: Generate SKU from product data
function generateSku(brand, model, colour) {
  const b = (brand || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const m = (model || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const c = (colour || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${b}${m}${c}`.substring(0, 50) || `unknown-${Date.now()}`;
}

// API: Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// API: Download CSV template
app.get('/api/template', (req, res) => {
  const template = `brand,sku,length_m,width_m,height_m,model,colour,set_per_ctn
Edifier,P12 Example,0.459,0.344,0.395,example-model,brown,2`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=sku_volume_template.csv');
  res.send(template);
});

// API: Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_KEY) {
    res.json({ token: ADMIN_KEY, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// API: Upload CSV (requires X-Admin-Key header)
app.post('/api/upload', (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let csvData;
  try {
    csvData = csv(req.body.csv, { columns: true, skip_empty_lines: true });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid CSV format' });
  }

  const products = csvData.map(row => {
    const length_m = parseFloat(row.length_m) || 0;
    const width_m = parseFloat(row.width_m) || 0;
    const height_m = parseFloat(row.height_m) || 0;
    const volume_per_ctn = calculateVolumePerCtn(length_m, width_m, height_m);

    return {
      brand: row.brand || 'Unknown',
      sku: row.sku || generateSku(row.brand, row.model, row.colour),
      model: row.model || '',
      colour: row.colour || '',
      set_per_ctn: parseFloat(row.set_per_ctn) || 1,
      volume_per_ctn: volume_per_ctn,
      carton_size: `${length_m}*${width_m}*${height_m}M`,
      length_m: length_m,
      width_m: width_m,
      height_m: height_m,
      moq: parseFloat(row.moq) || 0,
      updatedAt: new Date().toISOString()
    };
  }).filter(p => p.sku && p.volume_per_ctn > 0);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    res.json({ success: true, count: products.length, message: `Updated ${products.length} products` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save products' });
  }
});

// API: Get container info
app.get('/api/container', (req, res) => {
  res.json({
    type: '40ft HQ',
    internalLength: 12.03,
    internalWidth: 2.352,
    internalHeight: 2.393,
    maxVolume: 67.7
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Volume Calculator running on port ${PORT}`);
  console.log(`Admin password: ${ADMIN_KEY}`);
  console.log(`Data file: ${DATA_FILE}`);
});