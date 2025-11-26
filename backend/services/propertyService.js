const { supabaseAdmin } = require("../config/supabaseClient")



const BUCKET = process.env.BUCKET_NAME || 'property-photos';

async function insertPropertyRow(payload) {
  // payload is JS object without photos URLs
  const { data, error } = await supabaseAdmin.from('propertyapproval').insert([payload]).select().single();
  if (error) throw error;
  return data; // inserted row
}

async function updatePropertyPhotos(propertyId, photoUrls) {
  const { data, error } = await supabaseAdmin
    .from('propertyapproval')
    .update({ photos: photoUrls })
    .eq('id', propertyId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Upload buffer to storage and return public URL (or signed URL if private)
async function uploadBufferToStorage(path, buffer, contentType) {
  // path e.g. properties/{propertyId}/{filename}
  const result = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (result.error) throw result.error;

  // get public URL (works if bucket is public)
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}


const getAllPropertiesService = async () => {
  return await supabaseAdmin
      .from("propertyapproval")
      .select(`*, users (
        id,
        name,
        email,
        contact
      )`).eq("status" ,"pending")
      .order("created_at", { ascending: false }); 

};



const getPropertybyIDService = async (id) => {
  return await supabaseAdmin.from('propertyapproval').select(`*, users (
        id,
        name,
        email,
        contact
      )`).eq('id', id).single();

};



const setPropertytoApprovalService = async (id) => {
  try {
    
    const { data: property, error: fetchError } = await supabaseAdmin
      .from("propertyapproval")
      .update({status: "adminApproved"})
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!property) throw new Error("Property not found");

    
    // const { error: insertError } = await supabaseAdmin
    //   .from("approvedproperty")
    //   .insert([property]);

    // if (insertError) throw insertError;

   
    // const { error: deleteError } = await supabaseAdmin
    //   .from("propertyapproval")
    //   .delete()
    //   .eq("id", id);

    if (deleteError) throw deleteError;

    return { success: true, message: "Property approved successfully" };
  } catch (error) {
    console.error("Error approving property:", error);
    return { success: false, message: error.message };
  }
};



const setAllPartnerPropertyService = async (id) => {
   return await supabaseAdmin.from('propertyapproval').select(`*`).eq('user_id', id);
};






module.exports = {
  insertPropertyRow,
  updatePropertyPhotos,
  uploadBufferToStorage,
  getAllPropertiesService,
  getPropertybyIDService,
  setPropertytoApprovalService,
  setAllPartnerPropertyService
};
