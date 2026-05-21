const XLSX = require('xlsx');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { containers } = req.body || {};

    if (!containers || containers.length === 0) {
      return res.status(400).json({ error: 'Empty containers array' });
    }

    const wb = XLSX.utils.book_new();

    containers.forEach((container, index) => {
      const sheetName = 'Container-' + (index + 1);

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

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Product-Volume-Summary-${new Date().toISOString().split('T')[0]}.xlsx`);
    res.status(200).send(excelBuffer);
  } catch (err) {
    console.error('Excel generation error:', err);
    res.status(500).json({ error: 'Failed to generate Excel' });
  }
};