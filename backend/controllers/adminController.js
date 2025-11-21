const { supabaseAdmin } = require("../config/supabaseClient");
const { getFlagvalueService } = require("../services/adminService");

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

module.exports = { Change_Automation_flag_toauto,
     Change_Automation_flag_toManual,
     getFlagValue };