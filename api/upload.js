const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'products.json');
const ADMIN_KEY = process.env.ADMIN_KEY || 'vtm666';

function calculateVolumePerCtn(length_m, width_m, height_m) {
  if (length_m > 0 && width_m > 0 && height_m > 0) {
    return length_m * width_m * height_m;
  }
  return 0;
}

function generateSku(brand, model, colour) {
  const b = (brand || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const m = (model || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const c = (colour || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${b}${m}${c}`.substring(0, 50) || `unknown-${Date.now()}`;
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let csvData;
  try {
    const parsed = require('csv-parse/sync');
    csvData = parsed(req.body.csv || req.body, { columns: true, skip_empty_lines: true });
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
    res.status(200).json({ success: true, count: products.length, message: `Updated ${products.length} products` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save products' });
  }
};