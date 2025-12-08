// controllers/authController.js
const {
  signupUser,
  loginUser,
  checkUser,
  requestPasswordReset,
  updatePassword,
} = require("../services/authService");
const { createUserInDB } = require("../services/userService");
const { generateToken } = require("../services/jwtService");
const { supabaseAdmin } = require("../config/supabaseClient");

const signup = async (req, res) => {
  try {
    const { email, password, name, contact, city, role } = req.body;
    const isProduction = process.env.NODE_ENV === "production";

    const { data, error } = await signupUser(email, password);
    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user.id;

    console.log("Supabase Login Call () ");

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
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

const signupPartner = async (req, res) => {
  try {
    const form = req.body;
    console.log(form)
   
      const email =form.email
      const password =form.password
      const name = form.name 
      const contact = form.contact
      const CompanyName = form.CompanyName 
      const city = form.city 
      const role = form.role
      const excutiveType = form.excutiveType 
      const rera = form.rera

      console.log(email ,password,name,contact ,city, role ,excutiveType ,rera)



    const isProduction = process.env.NODE_ENV === "production";

    const { data, error } = await signupUser(email, password);
    if (error) return res.status(400).json({ error: error.message });

    const userId = data.user.id;

    // upload file
    let idProofUrl = null;
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `idproofs/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("Id Proof")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) return res.status(500).json({ error: "Upload failed" });

      const { data: urlData } = supabaseAdmin.storage
        .from("Id Proof")
        .getPublicUrl(filePath);

      idProofUrl = urlData.publicUrl;
    }

    // DB save
    const { error: dbError } = await createUserInDB({
      id: userId,
      email,
      name,
      contact,
      city,
      role,
      CompanyName,
      excutiveType,
      rera,
      idProof: idProofUrl,
    });

    if (dbError) return res.status(500).json({ error: dbError.message });

    // Token
    const token = generateToken({ id: userId, email, role });
    const cookieName = `token_${role}`;

    // res.cookie(cookieName, token, {
    //   httpOnly: true,
    //   secure: isProduction,
    //   sameSite: isProduction ? "none" : "lax",
    //   path: "/",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).json({ error: `Signup failed ${err}` });
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
      return res.status(403).json({ error: "Invalid role for this account" });
    }

    // Generate token with role
    const token = generateToken({
      id: data.user.id,
      email,
      role: roleFromDB,
    });

    // Define cookie name based on role
    const cookieName = `token_${roleFromDB}`;

    // Clear cookies for OTHER roles to prevent overlap
    ["admin", "user", "partner"].forEach((r) => {
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
      message: "Login successful",
      token,
      role: roleFromDB,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: `Login failed: ${err.message}` });
  }
};

const logOut = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Clear all role-specific cookies
  ["admin", "user", "partner"].forEach((role) => {
    res.clearCookie(`token_${role}`, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });
  });

  res.json({ message: "Logged out successfully" });
};

const handleRequestResetRoute = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email is required",
    });
  }

  const result = await requestPasswordReset(email);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
};

const handleUpdatePasswordRoute = async (req, res) => {
  const { password, token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "token is required",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      error: "Password is required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters",
    });
  }

  const result = await updatePassword(password, token);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(400).json(result);
  }
};

const googleAuthPartner = async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const auth_type = "google";

    if (!email || !name || !role) {
      return res
        .status(400)
        .json({ message: "Email, name and role are required" });
    }

    // 1️⃣ Check if user exists
    const { data: existingUser, error: findError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email).eq("role","partner")
      .single();

    if (existingUser && existingUser.auth_type == "email")
      return res.status(400).json({ message: "email already exist" });

    if (findError && findError.code !== "PGRST116") {
      return res.status(500).json({ message: findError.message });
    }

    let user = existingUser;

    // 2️⃣ If user doesn't exist → insert new user
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert([{ email, name, role, auth_type: auth_type }])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ message: insertError.message });
      }

      user = newUser;
    }

    // 3️⃣ Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

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

const resetContact = async (req, res) => {
  try {
    const { contact, city } = req.body;
    const id = req.user.id;

    const { data: existingUser, error: findError } = await supabaseAdmin
      .from("users")
      .update({ contact: contact, city: city })
      .eq("id", id)
      .single();

    return res.status(200).json({ message: "Details update Successfully " });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};




const resetContactPartner = async (req, res) => {
  try {
    const form = req.body;
    console.log(form)
   
      const id = req.user.id
      const contact = form.contact 
      const city = form.city 
      const excutiveType = form.excutiveType 
      const rera = form.rera 

    const isProduction = process.env.NODE_ENV === "production";;

    let idProofUrl = null;
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `idproofs/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("Id Proof")
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) return res.status(500).json({ error: `Upload failed ${uploadError}` });

      const { data: urlData } = supabaseAdmin.storage
        .from("Id Proof")
        .getPublicUrl(filePath);

      idProofUrl = urlData.publicUrl;
    }

    

      const { data: existingUser, error: findError } = await supabaseAdmin
      .from("users")
      .update({ contact: contact, city: city ,excutiveType:excutiveType,rera:rera,idProof:idProofUrl
        })
      .eq("id", id)
      .single();


    res.json({ message: "User created successfully"});
  } catch (err) {
    res.status(500).json({ error: `Signup failed ${err}` });
  }
};

module.exports = {
  signup,
  login,
  logOut,
  handleRequestResetRoute,
  handleUpdatePasswordRoute,
  googleAuthPartner,
  resetContact,
  signupPartner,
  resetContactPartner
};
