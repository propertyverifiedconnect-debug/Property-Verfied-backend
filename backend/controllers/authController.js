// controllers/authController.js
const { signupUser, loginUser, checkUser } = require('../services/authService');
const { createUserInDB } = require('../services/userService');
const { generateToken } = require('../services/jwtService');


const signup = async (req, res) => {
  try {
    const { email, password, name, contact, city, role } = req.body;
    const isProduction = process.env.NODE_ENV === "production";

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
     const cookieName = `token_${role}`;  
    
    res.cookie(cookieName, token, {
  httpOnly: true,
  secure: isProduction,   
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
  });

    res.json({ message: 'User created successfully', token });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const { data, error } = await loginUser(email, password);
//      console.log("Supabase Login Call () ")
//     if (error) return res.status(400).json({ error: error.message });

//     const token = generateToken({ id: data.user.id, email });
//     res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', path: '/',  maxAge: 24 * 60 * 60 * 1000 });

//     res.json({ message: 'Login successful', token });
//   } catch (err) {
//     res.status(500).json({ error: `Login failed ${err} ` });
//   }
// };


const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const isProduction = process.env.NODE_ENV === "production";
    
    console.log("Which Environment:", process.env.NODE_ENV);
    
    const { data, error } = await loginUser(email, password);
    console.log("Supabase Login Call()");

    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user.id;
    const { role: roleFromDB } = await checkUser(userId);
    console.log("DB role:", roleFromDB);
    
    // Verify role matches
    if (roleFromDB !== role) {
      return res.status(403).json({ error: 'Invalid role for this account' });
    }

    // Generate token with role
    const token = generateToken({ 
      id: data.user.id, 
      email, 
      role: roleFromDB 
    });

    // Define cookie name based on role
    const cookieName = `token_${roleFromDB}`;
    
    // Clear cookies for OTHER roles to prevent overlap
    ['admin', 'user', 'partner'].forEach(r => {
      if (r !== roleFromDB) {
        res.clearCookie(`token_${r}`, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          path: "/",
         
        });
      }
    });

    // Set the role-specific cookie
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
   
    });

     res.cookie(`client_${cookieName}`, token, {
      httpOnly: false,  // ✅ JavaScript CAN access this
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    
    console.log(`Set cookie: ${cookieName}`);
    
    res.json({ 
      message: 'Login successful', 
      token,
      role: roleFromDB 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: `Login failed: ${err.message}` });
  }
};

 const logOut = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  // Clear all role-specific cookies
  ['admin', 'user', 'partner'].forEach(role => {
    res.clearCookie(`token_${role}`, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/"
    });
  });

    ['admin', 'user', 'partner'].forEach(role => {
    res.clearCookie(`client_token_${role}`, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/"
    });
  });
  
  res.json({ message: 'Logged out successfully' });
};


module.exports = { signup, login ,logOut };
