const propertyService = require("../services/propertyService");

exports.createProperty = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware
    // Form fields come in req.body (all strings) and files in req.files
    const body = req.body;

    console.log(body);  

   
    const payload = {
      user_id: user.id,
      looking_for: body.lookingFor || null,
      property_kind: body.propertyKind || null,
      property_type: body.propertyType || null,
       property_name: body.propertyName || null,
      contact: body.contact || null,
      city: body.city || null,
      location: body.location || null,
      bedroom: body.bedroom || null,
      bathroom: body.bathroom || null,
      balconies: body.balconies || null,
      roomtype: body.roomtype || null,
      area: body.Area || null,
      area_unit: body.Areaunit || null,
      floor: body.floor || null,
      age_property: body.ageproperty || null,
      available: body.available || null, // expected YYYY-MM-DD
      available_for: body.availablefor || null,
      suitable_for: body.suitablefor || null,
      social_media: body.socialMedia || null,
      price: body.price ? parseFloat(body.price) : null,
      description: body.description || null,
       capacity:body.capacity ||null,
     alreadyrent: body.alreadyrent||null,
  profession:body.profession||null ,
  Lifestyle:body.Lifestyle || null,
  Apartmentsize:body.Apartmentsize || null,
      photos: null,
    };

    // Insert row first to get property id
    const inserted = await propertyService.insertPropertyRow(payload);
    const propertyId = inserted.id;

    // If files exist, upload them to storage and collect URLs
    const files = req.files || [];
    const uploadedUrls = [];

    for (const file of files) {
      // file: { originalname, buffer, mimetype }
      const safeName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
      const path = `properties/${propertyId}/${safeName}`;

      const publicUrl = await propertyService.uploadBufferToStorage(path, file.buffer, file.mimetype);
      uploadedUrls.push(publicUrl);
    }

    // Update property with photos URLs (array)
    if (uploadedUrls.length > 0) {
      await propertyService.updatePropertyPhotos(propertyId, uploadedUrls);
    }

    return res.json({ success: true, property: { ...inserted, photos: uploadedUrls } });
  } catch (err) {
    console.error('createProperty error', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};


exports.getAllProperties = async (req, res) => {
  try {
    const { data, error } = await propertyService.getAllPropertiesService() // optional: newest first

    if (error) throw error;

    res.status(200).json({
      message: "✅ ALL properties fetched successfully",
      count: data.length,
      properties: data,
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.getPropertybyID = async (req, res) => {
  try {
    const {id} = req.body
    const { data, error } = await propertyService.getPropertybyIDService(id) // optional: newest first

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


exports.setPropertytoApproval =  async (req, res) => {
  try {
    const {id} = req.body
    const { data, error } = await propertyService.setPropertytoApprovalService(id) 

    if (error) throw error;

    res.status(200).json({
      message: "✅ Property Approved  successfully",
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};