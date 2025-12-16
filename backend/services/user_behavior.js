const { supabaseAdmin } = require("../config/supabaseClient");

const SetUserBehaviorService = async ({userId , city , occupation , lifestyle , family_type})=> {
   return await supabaseAdmin.rpc('upsert_user_behavior',{
    p_user_id: userId,
    p_city: city || null,
    p_occupation: occupation || null , 
    p_lifestyle:lifestyle ||null,
    p_family_type: family_type || null
   })
}

module.exports = {SetUserBehaviorService}