 const {supabaseAdmin} = require("../config/supabaseClient")


const getFlagvalueService = async () => {
  return await supabaseAdmin.from("app settings").select("value").eq("Flag_name","automation_flag").single() 
};

module.exports ={getFlagvalueService}