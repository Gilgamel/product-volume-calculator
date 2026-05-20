const express = require('express');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log('Content-Type:', req.get('Content-Type'));
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/download', (req, res) => {
  console.log('Body keys:', Object.keys(req.body));
  console.log('Body:', JSON.stringify(req.body));

  let containers;
  if (req.body && req.body.containers) {
    containers = req.body.containers;
  } else {
    console.log('No containers in body!');
    return res.status(400).json({ error: 'No containers in request', body: JSON.stringify(req.body) });
  }

  if (!containers || containers.length === 0) {
    return res.status(400).json({ error: 'Empty containers array' });
  }

  console.log('Creating workbook with', containers.length, 'containers');

  const wb = XLSX.utils.book_new();

  containers.forEach((container, index) => {
    const sheetName = 'Container-' + (index + 1);
    console.log('Adding sheet:', sheetName, 'products:', container.products?.length);

    const detailData = container.products.map(sp => {
      const ctnsNeeded = Math.ceil(sp.qty / sp.set_per_ctn);
      const totalProductVol = ctnsNeeded * sp.volume_per_ctn;
      return {
        'Container': index + 1,
        'Brand': sp.brand || '',
        'SKU': sp.sku,
        'Model': sp.model || '',
        'Colour': sp.colour || '',
        'Qty': sp.qty,
        'SETS/CTN': sp.set_per_ctn,
        'CTNs Needed': ctnsNeeded,
        'Vol/CTN': sp.volume_per_ctn.toFixed(6),
        'Total Vol': totalProductVol.toFixed(6)
      };
    });

    const sheet = XLSX.utils.json_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, sheet, sheetName);
  });

  console.log('Final sheets:', wb.SheetNames);

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=Product-Volume-Summary-${new Date().toISOString().split('T')[0]}.xlsx`);
  res.status(200).send(buffer);
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});