// backend/supabaseClient.js
const { createClient } = require ('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

  const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      // Prevents the admin client from trying to manage a session
      autoRefreshToken: false, 
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);


module.exports =  {supabaseAdmin}

