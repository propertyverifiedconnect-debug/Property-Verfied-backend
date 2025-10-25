// controllers/authController.js
const { signupUser, loginUser } = require('../services/authService');
const { createUserInDB } = require('../services/userService');
const { generateToken } = require('../services/jwtService');

const signup = async (req, res) => {
  try {
    const { email, password, name, contact, city, role } = req.body;

    const { data, error } = await signupUser(email, password);
    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user.id;

    console.log("Supabase Login Call () ")

    const { error: dbError } = await createUserInDB({
      id: userId,
      email,
      name,
      contact,
      city,
      role,
    });
    if (dbError) return res.status(500).json({ error: dbError.message });

    const token = generateToken({ id: userId, email, role });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });

    res.json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await loginUser(email, password);
     console.log("Supabase Login Call () ")
    if (error) return res.status(400).json({ error: error.message });

    const token = generateToken({ id: data.user.id, email });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: `Login failed ${err} ` });
  }
};

module.exports = { signup, login };
