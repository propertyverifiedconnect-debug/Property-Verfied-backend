const { GoogleGenerativeAI } = require("@google/generative-ai");
const { supabaseAdmin } = require("../config/supabaseClient");
const { json } = require("express");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function GeminiCall(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw error;
  }
}

const Getprompt = (mode, answer, question) => {
  if (mode == "budget") {
    return `
        your the Budget analyiser for the for the Property whcih porperty kind of property should buy 
        so the user answer some question-> 
       ${
         question
           .map((item, index) => {
             return `
          Question: ${item}
          Answer: ${answer[index]}`;
           })
           .join("\n") // Joins the array into a single string
       }
     as the   Budget analyiser analyses the budget using answer return output in json as follows 
      {
       safe_purchase_limit : analyis the Safe Purchase Limit the limit in the lowernumber-uppernumber limit in Number format ,
       emi_capacity : give the emi capacity for the per month,
       risk:risk level (high , low , mid),
       recommandation : why to buy this kind of budget with satatisics and make it short of 2-3 lines only   
      }
      
      `;
  }
  if (mode == "category") {
    return `
        your the People's Category Choice analyiser for the for the Property , which take the question and find the best suitable envoirnemt
        depend on there profession in his particular area of his city    
        so the user answer some question-> 
       ${
         question
           .map((item, index) => {
             return `
          Question: ${item}
          Answer: ${answer[index]}`;
           })
           .join("\n") // Joins the array into a single string
       }
     as the People's Category Choice analyiser the question and find the best suitable spot in that are using answer return output in json as follows 
      {
       best_match :best_match according to his profession what is best for him to be a part of , means if he is a  IT Professionals then the best match is Young IT Professionals Hub  ,
       recommandation : why this is the best match  and make it short of 2-3 lines only  , 
       area : Which are of the city his perfect for him it will be the array , 
       people : Or any people in that particular who belongs to same profession or the diffrent but can help you and give there personal info like name , profession and area and the image link ,
       matching_score : it is a score for from 1 to 100 which tell how many the area is match for the user
      }
       donot give the Explanation of Choices only json response       `;
  } else if (mode == "discuss") {
    return `
      Your are the Property Verified Assitants who you give the answer about the any property related question
      if the question is related to property then its ok but if its not then , said that can you get back to the topic 
      and answer the question in the json format only json
      the question of the user is 
      question :${answer}
      {
       answer: give the answer of  the question  in the text only discription not json , not Object just texto;
      }
      
    `;
  } else {
    return `new mode : ${mode}`;
  }
};

const cleanAndParseJSON = (aiResponseString) => {
  // 1. Remove "```json" (case insensitive) and "```"
  // 2. Trim extra whitespace
  const cleanString = aiResponseString
    .replace(/```json/gi, "") // Remove opening fence
    .replace(/```/g, "") // Remove closing fence
    .trim(); // Remove leading/trailing whitespace

  try {
    // 3. Convert string to actual JSON Object
    return JSON.parse(cleanString);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null; // or handle error appropriately
  }
};

const getRentServices = async (answer) => {
  const city = answer[0].toLowerCase();
  const room = answer[1] == "Shared room" ? "Shared" : "Private";
  const budget = answer[2];
  const profession = answer[3];

  console.log(city, room, profession, budget);

  const { data, error } = await supabaseAdmin
    .from("propertyapproval")
    .select("* ,user_id(name)")
    .eq("looking_for", "Rent / Lease")
    .eq("city", city)
    .eq("roomtype", room)
    .eq("profession", profession); // Rent <= budget
  // Sort by cheapest first

  if (error) {
    console.error("Supabase query error:", error);
    throw new Error(error.message);
  }

  // ✅ Return empty array if no results
  return data || [];
};

const GetBudgetPropertyService = async (budget) => {
  const Budget = budget.split("-");
  const min = Budget[0];
  const max = Budget[1];

  return await supabaseAdmin
    .from("propertyapproval")
    .select("*")
    .gte("price", min)
    .lte("price", max)
    .limit(2);
};

const GetCategoryPropertyService = async (lowerArea, city) => {
  const orCondition = lowerArea
    .map((area) => `location.ilike.%${area}%`)
    .join(",");

  return await supabaseAdmin
    .from("propertyapproval")
    .select("*")
    .eq("city", city)
    .or(orCondition)
    .limit(2);
};

const GetAIresponseUserService = async (user_behavior, property_details) => {
  

  const prompt = `You are an AI property purchase predictor. Analyze the user's search history and behavior patterns, then evaluate how well the given property matches their preferences.

TASK:
Compare the user's historical search patterns with the property details provided and predict the likelihood of purchase.

USER SEARCH HISTORY & BEHAVIOR:
${JSON.stringify(user_behavior, null, 2)}

PROPERTY DETAILS TO EVALUATE:
${JSON.stringify(property_details, null, 2)}

ANALYSIS INSTRUCTIONS:
1. Examine the user's historical preferences:
   - Preferred cities and locations
   - Occupation and lifestyle patterns
   - Family type and living situation
   - Consistency or changes in search behavior

2. Match against property characteristics:
   - Location alignment (city, specific area)
   - Property type and size suitability
   - Lifestyle compatibility (social/quiet preferences)
   - Price point reasonableness for their profile
   - Amenities and features match
   - Availability alignment (gender preference, tenant type)

3. Consider deal-breakers and strong matches:
   - Identify any mismatches that would significantly reduce purchase likelihood
   - Highlight strong alignment factors that increase purchase probability

OUTPUT REQUIREMENTS:
Return ONLY a valid JSON object with no additional text, explanations, or markdown formatting. Use this exact structure:

{
  "AI_Percentage": <number between 0-100 , which is the chance of , how likily the user will buy the porperty> ,
  "AI_Description": "<4-5 sentences explaining the key factors influencing the prediction, including both positive matches and concerns>",
  "AI_Behaviortype": "<1-3 words describing the user's primary property preference pattern, e.g., 'Urban Social Living', 'Budget Conscious', 'Family Oriented'>"
}

IMPORTANT:
- AI_Percentage should be realistic (0-100), considering all matching and mismatching factors
- AI_Description should be specific and reference actual data points from the analysis
- AI_Behaviortype should capture the essence of what drives the user's property decisions
- Return ONLY the JSON object, nothing else`;



  const data = await GeminiCall(prompt);
  const  cleanResponse = cleanAndParseJSON(data)


  console.log(data)

 return {
  AI_Percentage: cleanResponse.AI_Percentage,
  AI_Description: cleanResponse.AI_Description,
  AI_Behaviortype: cleanResponse.AI_Behaviortype
};
};

module.exports = {
  GeminiCall,
  Getprompt,
  cleanAndParseJSON,
  getRentServices,
  GetBudgetPropertyService,
  GetCategoryPropertyService,
  GetAIresponseUserService,
};
