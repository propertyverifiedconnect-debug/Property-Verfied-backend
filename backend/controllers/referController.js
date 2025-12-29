// controllers/authController.js

const { getFlagvalueService, checkSuspiciousPartnerService } = require("../services/adminService");
const { partnerIDprojectNameService, referIntoDBService, getCustomerleadService, setCustomerleadtoApprovalService, getAllApprovedLeadService, getPropertyNameService } = require("../services/referService");
const { getFlagValue } = require("./adminController");



const referIntoDB = async (req, res) => {
  try {
    const {  customerName,
    contactNumber,
    profession,
    budgetRange,
    projectName,
    notes,
    referralName} = req.body;


   const {data , error} = await partnerIDprojectNameService(projectName)
   console.log(  "partner id - ", data.user_id)
   const  flag = await checkSuspiciousPartnerService(data.user_id)
    console.log("flag - ",flag)
    const {stage , stageerror} = await referIntoDBService( customerName,
    contactNumber,
    profession,
    budgetRange,
    projectName,
    notes,
    referralName, 
    data.user_id,
    flag.data.suspect
  )

    
   console.log(error ,"new error", stageerror)
    res.json({ message: 'refer instead ✨', error , stageerror });
  } catch (err) {
    res.status(500).json({ error: 'refer instead fail ✨' , err });
  }
};



 const  getAllLeadtoApproved = async (req, res) => {
  try { 
    const { data, error } = await getCustomerleadService()

    if (error) throw error;

    res.status(200).json({
      message: "✅ properties fetched successfully",
      customer_leads :data
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};


 const setCustomerleadtoApproval = async (req, res) => {
  try {
    
   const {id} = req.body
   
    const { data, error } = await setCustomerleadtoApprovalService(id);

    if (error) throw error;

    res.status(200).json({
      message: "✅ properties fetched successfully",
      booking :data
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};


 const getAllApprovedLead = async (req, res) => {
   
  try { 

    const user = req.user.id
    console.log( " partner id with get - ", user)
    const { data, error } = await getAllApprovedLeadService(user)

    if (error) throw error;

    res.status(200).json({
      message: "✅ properties fetched successfully",
      customer_leads :data
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};


 const getPropertyName= async (req, res) => {
   
  try { 

    const { data, error } = await getPropertyNameService()

    if (error) throw error;

    res.status(200).json({
      message: "✅ Property Name fetched successfully",
      Property_name :data
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { referIntoDB ,getAllLeadtoApproved ,setCustomerleadtoApproval ,getAllApprovedLead ,getPropertyName };
