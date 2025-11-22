const { supabaseAdmin } = require("../config/supabaseClient");
const { getFlagvalueService, getALLpartnerService, markSuspiciousPartnerService, getALLSuspiciousPartnerService, removeSuspiciousPartnerService } = require("../services/adminService");

const Change_Automation_flag_toauto = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("app settings")
      .update({ value: "auto" })
      .eq("Flag_name", "automation_flag")
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data.value);
    res.status(200).json({ message: "Flag updated", flag: data.value });
  } catch (err) {
    res.status(500).json({ error: "Failed to update flag", err: err.message });
  }
};

const Change_Automation_flag_toManual = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("app settings")
      .update({ value: "manual" })
      .eq("Flag_name", "automation_flag")
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data.value);
    res.status(200).json({ message: "Flag updated", flag: data.value });
  } catch (err) {
    res.status(500).json({ error: "Failed to update flag", err: err.message });
  }
};

const getFlagValue = async (req, res) => {
  try {
    const {data ,error} = await getFlagvalueService()
    console.log(data)

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data.value);
    res.status(200).json({ message: "Flag updated", flag: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update flag", err: err});
  }
};


const getALLpartner = async (req, res) => {
  try {
    const {data ,error} = await getALLpartnerService();
    console.log(data)

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data);
    res.status(200).json({ message: "Flag updated", partners: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update flag", err: err});
  }
};

const markSuspiciousPartner = async (req, res) => {
  try {
    const {partnerId} = req.body
    console.log(partnerId)
    const {data , error} = await markSuspiciousPartnerService(partnerId);
    console.log(data)

     if (!partnerId) {
      return res.status(400).json({ error: "Partner ID is required" })
    }
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data);
    res.status(200).json({ message: "Flag updated", partners: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update flag", err: err});
  }
};

const removeSuspiciousPartner = async (req, res) => {
  try {
    const {partnerId} = req.body
    console.log(partnerId)
    const {data , error} = await removeSuspiciousPartnerService(partnerId);
    console.log(data)

     if (!partnerId) {
      return res.status(400).json({ error: "Partner ID is required" })
    }
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data);
    res.status(200).json({ message: "Flag updated", partners: data });
  } catch (err) {
    res.status(500).json({ error: "Failed to update flag", err: err});
  }
};

const getALLSuspiciousPartner = async (req, res) => {
  try {
    const {data ,error} = await  getALLSuspiciousPartnerService();
    console.log(data)

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    console.log(data);

    res.status(200).json({ message: "partner list successfully ", partners: data });
  } catch (err) {
    res.status(500).json({ error: "fail to get  partner ", err: err});
  }
};

module.exports = { 
    Change_Automation_flag_toauto,
    Change_Automation_flag_toManual,
    getFlagValue ,
    getALLpartner ,
    markSuspiciousPartner,
    getALLSuspiciousPartner,
    removeSuspiciousPartner};