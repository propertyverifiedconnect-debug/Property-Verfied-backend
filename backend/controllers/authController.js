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
    const { email, password ,role } = req.body;
    const isProduction = process.env.NODE_ENV === "production";
    
   
      console.log (" which Envorment : ", process.env.NODE_ENV)
      const { data, error } = await loginUser(email, password);
       console.log("Supabase Login Call () ")

      if (error) return res.status(400).json({ error: error.message });

      const userId = data.user.id

     const { role: roleFromDB } = await checkUser(userId);
      console.log("DB role:", roleFromDB);
          

       if (roleFromDB !== role) {
      return res.status(403).json({ error: 'Invalid role for this account' });
    }
      const token = generateToken({ id: data.user.id, email , role: roleFromDB });
      const cookieName = `token_${role}`;  
  
       ['admin', 'user', 'partner'].forEach(r => {
      if (r !== roleFromDB) {
        res.clearCookie(`token_${r}`, { path: '/' });
      }
    });

  
  res.cookie(cookieName, token, {
  httpOnly: true,
  secure: isProduction,   
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
  });
     
     
      res.json({ message: 'Login successful', token });
    }
     catch (err) {
    res.status(500).json({ error: `Login failed ${err} ` });
  }
};

  const logOut = async (req, res) => {
  try {
     const user = req.user.id
     const isProduction = process.env.NODE_ENV === "production";
     console.log(user)
     const mode = await checkUser(user)

    console.log("Logout mode - " , mode.role)

    res.clearCookie(`token_${mode.role}`, {
      httpOnly: true,
      secure: isProduction, // only secure in production
      sameSite: isProduction ? "none" : "lax",
      path: "/", // important:must match the path where it was set
    });

    return res.status(200).json({ message: "✅ Logged out successfully!" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { signup, login ,logOut };
