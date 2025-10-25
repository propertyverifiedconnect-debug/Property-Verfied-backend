// controllers/userController.js
const { getUserById } = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const { data, error } = await getUserById(req.user.id);
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const getDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.role}` });
};

module.exports = { getProfile, getDashboard };
