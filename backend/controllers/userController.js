// controllers/userController.js
const { getUserById, getAllApprovedPropertyService, getApprovedPropertybyIDService } = require('../services/userService');

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




module.exports = { getProfile, getDashboard , getAllApprovedProperty,getApprovedPropertybyID  };
