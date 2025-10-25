const { supabaseAdmin } = require('../config/supabaseClient');

 const signupUser = async (email, password) => {
  return await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
};

 const loginUser = async (email, password) => {
  return await supabaseAdmin.auth.signInWithPassword({ email, password });
};


module.exports = { signupUser, loginUser }