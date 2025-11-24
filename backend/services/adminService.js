 const {supabaseAdmin} = require("../config/supabaseClient")


const getFlagvalueService = async () => {
  return await supabaseAdmin.from("app settings").select("value").eq("Flag_name","automation_flag").single() 
};


const getALLpartnerService= async() =>{
  return await supabaseAdmin.from("users").select("*").eq("role","partner").eq("suspect","FALSE")
} 

const  getALLSuspiciousPartnerService= async() =>{
  return await supabaseAdmin.from("users").select("*").eq("suspect","TRUE").eq("role","partner")
} 

const markSuspiciousPartnerService= async(partnerid) =>{
  return await supabaseAdmin.from("users").update({suspect :true}).eq("id",partnerid)
}


const removeSuspiciousPartnerService = async(partnerid) =>{
  return await supabaseAdmin.from("users").update({suspect :false}).eq("id",partnerid)
}

const checkSuspiciousPartnerService = async(partnerid) =>{
  return await supabaseAdmin.from("users").select("suspect").eq("id",partnerid).single()
}

module.exports ={getFlagvalueService 
  , getALLpartnerService ,
markSuspiciousPartnerService ,
getALLSuspiciousPartnerService,
removeSuspiciousPartnerService,
checkSuspiciousPartnerService }