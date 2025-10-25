// backend/supabaseClient.js
const { createClient } = require ('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

  const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


module.exports =  {supabaseAdmin}

