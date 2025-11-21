// controllers/authController.js

const { getFlagvalueService } = require("../services/adminService");
const { partnerIDprojectNameService, referIntoDBService, getCustomerleadService, setCustomerleadtoApprovalService, getAllApprovedLeadService } = require("../services/referService");
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
   const  flag = await getFlagvalueService();
   
    const {stage , stageerror} = await referIntoDBService( customerName,
    contactNumber,
    profession,
    budgetRange,
    projectName,
    notes,
    referralName, 
    data.user_id,
    flag.data.value
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
    const { data, error } = await getAllApprovedLeadService()

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


module.exports = { referIntoDB ,getAllLeadtoApproved ,setCustomerleadtoApproval ,getAllApprovedLead };
