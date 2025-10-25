const { supabaseAdmin } = require("../config/supabaseClient")

const createUserInDB = async (userData) => {
  return await supabaseAdmin.from('users').insert([userData]);
};

const getUserById = async (id) => {
  return await supabaseAdmin.from('users').select('*').eq('id', id).single();
};

module.exports = { createUserInDB, getUserById };