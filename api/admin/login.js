const ADMIN_KEY = process.env.ADMIN_KEY || 'vtm666';

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body || {};
    if (password === ADMIN_KEY) {
      res.status(200).json({ token: ADMIN_KEY, message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};