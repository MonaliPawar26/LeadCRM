const jwt = require('jsonwebtoken');
const { mockUser } = require('../mockData.js');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Login with any credentials
  res.json({
    _id: mockUser._id,
    email: email || 'user@example.com',
    token: generateToken(mockUser._id),
  });
};


module.exports = { loginUser };

