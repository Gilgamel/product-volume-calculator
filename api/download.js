const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { summary, details } = req.body || {};
    const today = new Date().toISOString().split('T')[0];

    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      { Field: 'Date', Value: today },
      { Field: 'Container Type', Value: '40ft HQ' },
      { Field: 'Total Volume', Value: summary?.totalVolume || '0 CBM' },
      { Field: 'Containers Needed', Value: summary?.containersNeeded || 0 },
      { Field: 'Remaining Space', Value: summary?.remainingSpace || '0 CBM' },
      { Field: 'Space Utilization', Value: summary?.utilization || '0%' }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Detail sheet
    if (details && details.length > 0) {
      const detailSheet = XLSX.utils.json_to_sheet(details);
      XLSX.utils.book_append_sheet(wb, detailSheet, 'Detail');
    }

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Product-Volume-Summary-${today}.xlsx`);
    res.status(200).send(excelBuffer);
  } catch (err) {
    console.error('Excel generation error:', err);
    res.status(500).json({ error: 'Failed to generate Excel' });
  }
};