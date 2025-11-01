const { supabaseAdmin } = require("../config/supabaseClient")

const createUserInDB = async (userData) => {
  return await supabaseAdmin.from('users').insert([userData]);
};

const getUserById = async (id) => {
  return await supabaseAdmin.from('users').select('*').eq('id', id).single();
};

const getAllApprovedPropertyService = async()=>{
  return await supabaseAdmin
      .from("approvedproperty")
      .select(`*, users (
        id,
        name,
        email,
        contact
      )`)
      .order("created_at", { ascending: false }); 
};

const getApprovedPropertybyIDService = async(id) =>{
  return await supabaseAdmin.from('approvedproperty').select(`*, users (
        id,
        name,
        email,
        contact
      )`).eq('id', id).single();
}


const setApprovalBookingService = async(propertyid, visitType, date, timeSlot ,userid) =>{
  return await supabaseAdmin
      .from('bookings')
      .insert({
        approved_property_id: propertyid,
        user_id: userid,
        visit_type: visitType,
        visit_date: date,
        visit_time: timeSlot,
        status: 'pending'
      })
      .select()
      .single();
}


const getBookingforApprovalService = async () => {
  return await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      approved_property_id (
        id,
        location,
        city,
        property_type,
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
      approved_property_id (
        id,
        location,
        city,
        property_type,
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
      approved_property_id (
        id,
        location,
        city,
        property_type,
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
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
}


module.exports = { createUserInDB, getUserById 
,getAllApprovedPropertyService ,getApprovedPropertybyIDService,
setApprovalBookingService ,getBookingforApprovalService,
getBookingforApprovalbyIDService ,setBookingtoApprovalService ,
getApprovedBookingService
};