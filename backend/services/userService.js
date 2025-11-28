const { supabaseAdmin } = require("../config/supabaseClient")

const createUserInDB = async (userData) => {
  return await supabaseAdmin.from('users').insert([userData]);
};

const getUserById = async (id) => {
  return await supabaseAdmin.from('users').select('*').eq('id', id).single();
};

const getAllApprovedPropertyService = async()=>{
  return await supabaseAdmin
      .from("propertyapproval")
      .select(`*, users (
        id,
        name,
        email,
        contact
      )`).eq("status","adminApproved")
      .order("created_at", { ascending: false }); 
};

const getApprovedPropertybyIDService = async(id) =>{
  return await supabaseAdmin.from('propertyapproval').select(`*, users (
        id,
        name,
        email,
        contact
      )`).eq('id', id).single();
}


const setApprovalBookingService = async(propertyid, visitType, date, timeSlot ,userid ,suspect) =>{
  return await supabaseAdmin
      .from('bookings')
      .insert({
        property_approved: propertyid,
        user_id: userid,
        visit_type: visitType,
        visit_date: date,
        visit_time: timeSlot,
        status: suspect ==false ? 'approved': 'pending'
      })
      .select()
      .single();
}


const getBookingforApprovalService = async () => {
  return await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      property_approved(
        id,
        location,
        city,
        property_type,
        property_name,
        price,
        photos,
        user_id (
          id,
          name,
          email
        )
      ),
      user_id (
        id,
        name,
        email,
        contact
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

}


const getBookingforApprovalbyIDService = async (id) => {
  return await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      property_approved(
        id,
        location,
        city,
        property_type,
          property_name,
          status,
        price,
        photos,
        user_id (
          id,
          name,
          email
        )
      ),
      user_id (
        id,
        name,
        email,
        contact
      )
    `)
    .eq('id', id)
    .single();
}


const setBookingtoApprovalService = async (id) => {
  return await supabaseAdmin
    .from('bookings')
    .update({ status: 'approved' })
    .eq('id', id)
    .single();
}



const getApprovedBookingService = async (id) => {
  return await supabaseAdmin
    .from('bookings')
    .select(`
      *,
       property_approved!inner(
        id,
        location,
        city,
        property_type,
           property_name,
        price,
        photos,
        user_id (
          id,
          name,
          email
        )
      ),
      user_id (
        id,
        name,
        email,
        contact
      )
    `).eq("property_approved.user_id",id)
    .order('created_at', { ascending: false });
}


const getUserOrderService = async (id) =>{
  return supabaseAdmin.from('bookings').select(` *, property_approved(
        id,
        location,
        city,
        property_type,
        price,
        property_name,
        photos,
        user_id (
          id,
          name,
          email,
          contact
        )
      )
    `).eq("user_id" ,id)
}


module.exports = { createUserInDB, getUserById 
,getAllApprovedPropertyService ,getApprovedPropertybyIDService,
setApprovalBookingService ,getBookingforApprovalService,
getBookingforApprovalbyIDService ,setBookingtoApprovalService ,
getApprovedBookingService ,
getUserOrderService
};