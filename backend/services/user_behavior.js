const { supabaseAdmin } = require("../config/supabaseClient");

const SetUserBehaviorService = async ({
  userId,
  city,
  occupation,
  lifestyle,
  family_type,
  Rent_area,
  Purchase_Budget,
  Rent_Budget,
  Rent_property_type,
  Profession,
  Roommate_type,
  DrinkOrSmoke,
  Food_perferances,
  Religion
}) => {
  return await supabaseAdmin.rpc('upsert_user_behavior', {
    p_user_id: userId,
    p_city: city || null,
    p_occupation: occupation || null,
    p_lifestyle: lifestyle || null,
    p_family_type: family_type || null,
    p_rent_area: Rent_area || null,
    p_purchase_budget: Purchase_Budget || null,
    p_rent_budget: Rent_Budget || null,
    p_rent_property_type: Rent_property_type || null,
    p_profession: Profession || null,
    p_roommate_type: Roommate_type || null,
    p_food_preferences: Food_perferances|| null,
    p_drinkorsmoke: DrinkOrSmoke || null,
    p_religion: Religion || null
  });
};

module.exports = { SetUserBehaviorService };