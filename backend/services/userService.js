const { supabaseAdmin } = require("../config/supabaseClient")

const createUserInDB = async (userData) => {
  return await supabaseAdmin.from('users').insert([userData]);
};

const getUserById = async (id) => {
  return await supabaseAdmin.from('users').select('*').eq('id', id).single();
};

const getAllApprovedPropertyService = async()=>{
  return await supabaseAdmin
      .from("approvedproperty")
      .select(`*, users (
        id,
        name,
        email,
        contact
      )`)
      .order("created_at", { ascending: false }); 
};

const getApprovedPropertybyIDService = async() =>{
  return await supabaseAdmin.from('propertyapproval').select(`*, users (
        id,
        name,
        email,
        contact
      )`).eq('id', id).single();
}



module.exports = { createUserInDB, getUserById 
,getAllApprovedPropertyService ,getApprovedPropertybyIDService};