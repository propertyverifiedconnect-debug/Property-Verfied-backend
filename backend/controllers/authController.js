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
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: `Login failed ${err} ` });
  }
};

  const logOut =  (req, res) => {
  try {
    // 🔹 Clear the HttpOnly token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: "strict",
      path: "/", // important: must match the path where it was set
    });

    return res.status(200).json({ message: "✅ Logged out successfully!" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { signup, login ,logOut };
