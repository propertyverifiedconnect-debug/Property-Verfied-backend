
const { supabaseAdmin } = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');

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


const requestPasswordReset = async(email) => {
  try {
    const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `https://property-verfied-partner.vercel.app/auth/forgot-password/reset-password`,
    })

    if (error) throw error

    return {
      success: true,
      message: 'Password reset email sent successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}


const updatePassword = async(newPassword ,token) => {

   
  try {
const decodedToken = jwt.decode(token);
        const userId = decodedToken?.sub; 
         console.log(token  , "userlog -" ,userId)

        if (!userId) {
            throw new Error("Invalid token: Could not extract user ID.");
        }
   const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            userId, // Pass the userId as the FIRST argument
            { password: newPassword } // Pass the update object as the SECOND argument
        );
    if (error) throw error

    return {
      success: true,
      message: 'Password updated successfully',
      user: data.user
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}




module.exports = { signupUser, loginUser , checkUser , requestPasswordReset ,updatePassword}