// controllers/userController.js
const { getFlagvalueService } = require('../services/adminService');
const { getUserById, getAllApprovedPropertyService, getApprovedPropertybyIDService, setApprovalBookingService, getBookingforApprovalService, getBookingforApprovalbyIDService, setBookingtoApprovalService, getApprovedBookingService, getUserOrderService } = require('../services/userService');

const getProfile = async (req, res) => {
  try {
    const { data, error } = await getUserById(req.user.id);
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

const getDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.role}` });
};


const getAllApprovedProperty  = async (req, res) => {
    try {
      const { data, error } = await getAllApprovedPropertyService(); 
    
  
      if (error) throw error;
  
      res.status(200).json({
        message: "✅ ALL properties fetched successfully",
        properties: data,
      });
    } catch (error) {
      console.error("❌ Error fetching properties:", error);
      res.status(500).json({ error: error.message });
    }
};



 const getApprovedPropertybyID = async (req, res) => {
  try {
    const { id } = req.body
    console.log(id)
    const { data, error } = await getApprovedPropertybyIDService(id) // optional: newest first

    if (error) throw error;

    res.status(200).json({
      message: "✅ properties fetched successfully",
      properties: data,
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};



 const setApprovalBooking = async (req, res) => {
  try {
    const { propertyid, visitType, date, timeSlot } = req.body;
    const  user = req.user;
    const flag = await getFlagvalueService()

    console.log(propertyid, visitType, date, timeSlot ,user.id ,)
   
   
    const { data, error } = await setApprovalBookingService( propertyid, visitType, date, timeSlot ,user.id ,flag.data.value) 

    if (error) throw error;

    res.status(200).json({
      message: "✅ properties fetched successfully",
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};


 const getBookingforApproval = async (req, res) => {
  try {
    
  
   
    const { data, error } = await getBookingforApprovalService()

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



 const getBookingforApprovalbyID = async (req, res) => {
  try {
    
   const {id} = req.body
   
    const { data, error } = await getBookingforApprovalbyIDService(id)

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



 const setBookingtoApproval = async (req, res) => {
  try {
    
   const {id} = req.body
   
    const { data, error } = await setBookingtoApprovalService(id)

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


 const getApprovedBooking = async (req, res) => {
  try {
    
  
   
    const { data, error } = await getApprovedBookingService()

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



 const getUserOrder = async (req, res) => {
  try {
    
   const user  = req.user.id
   
    const { data, error } = await getUserOrderService(user)

    if (error) throw error;

    res.status(200).json({
      message: "✅order fetched successfully",
      booking :data
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};




module.exports = { getProfile, getDashboard ,
   getAllApprovedProperty,getApprovedPropertybyID , 
   setApprovalBooking , getBookingforApproval ,
  getBookingforApprovalbyID,
setBookingtoApproval , getApprovedBooking ,getUserOrder };
