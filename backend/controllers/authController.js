// controllers/authController.js
const { signupUser, loginUser, checkUser, requestPasswordReset, updatePassword } = require('../services/authService');
const { createUserInDB } = require('../services/userService');
const { generateToken } = require('../services/jwtService');
const { supabaseAdmin } = require('../config/supabaseClient');


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
  
  res.json({ message: 'Logged out successfully' });
};

const handleRequestResetRoute = async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    })
  }

  const result = await requestPasswordReset(email)
  
  if (result.success) {
    return res.status(200).json(result)
  } else {
    return res.status(400).json(result)
  }
}


const  handleUpdatePasswordRoute = async(req, res) => {
  const { password , token } = req.body


   if (!token) {
    return res.status(400).json({
      success: false,
      error: 'token is required'
    })
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required'
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters'
    })
  }

  const result = await updatePassword(password ,token)
  
  if (result.success) {
    return res.status(200).json(result)
  } else {
    return res.status(400).json(result)
  }
}


const googleAuth = async (req, res) => {
  try {
    const { email, name, role } = req.body
    const auth_type = 'google'

    if (!email || !name || !role) {
      return res.status(400).json({ message: "Email, name and role are required" });
    }

    // 1️⃣ Check if user exists
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

      if(existingUser.auth_type == "email") return  res.status(400).json({ message: "email already exist" });

    if (findError && findError.code !== 'PGRST116') {
      return res.status(500).json({ message: findError.message });
    }

    let user = existingUser;

    // 2️⃣ If user doesn't exist → insert new user
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert([{ email, name, role , auth_type}])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ message: insertError.message });
      }

      user = newUser;
    }

    // 3️⃣ Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    // 4️⃣ Return user + JWT
    return res.status(200).json({
      success: true,
      jwt: token,
      user,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};





module.exports = { signup, login ,logOut , handleRequestResetRoute ,handleUpdatePasswordRoute , googleAuth };
