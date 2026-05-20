module.exports = (req, res) => {
  const template = `brand,sku,length_m,width_m,height_m,model,colour,set_per_ctn
Edifier,P12 Example,0.459,0.344,0.395,example-model,brown,2`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=sku_volume_template.csv');
  res.status(200).send(template);
};