module.exports = (req, res) => {
  res.status(200).json({
    type: '40ft HQ',
    internalLength: 12.03,
    internalWidth: 2.352,
    internalHeight: 2.393,
    maxVolume: 67.7
  });
};