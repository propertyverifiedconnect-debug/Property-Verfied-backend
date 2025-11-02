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

const checkUser = async (userid) => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userid)
    .single();

  if (error || !data) {
    throw new Error('User not found or unable to fetch role');
  }
  return data;
};


module.exports = { signupUser, loginUser , checkUser}