const { GoogleGenerativeAI } =  require("@google/generative-ai")


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function GeminiCall(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    throw error;
  }
}




 const Getprompt = (mode , answer , question) =>{

  if(mode == "budget")
  {
      return `
        your the Budget analyiser for the for the Property whcih porperty kind of property should buy 
        so the user answer some question-> 
       ${question.map((item, index) => {
          return `
          Question: ${item}
          Answer: ${answer[index]}`;
        }).join('\n') // Joins the array into a single string
      }
     as the   Budget analyiser analyses the budget using answer return output in json as follows 
      {
       safe_purchase_limit : analyis the Safe Purchase Limit the limit in the lowernumber-uppernumber limit lakh format ,
       emi_capacity : give the emi capacity for the per month,
       risk:risk level (high , low , mid),
       recommandation : why to buy this kind of budget with satatisics and make it short of 2-3 lines only   
      }
      
      `
  }else{
    return `new mode : ${mode}`
  }




}


const cleanAndParseJSON = (aiResponseString) => {
  // 1. Remove "```json" (case insensitive) and "```" 
  // 2. Trim extra whitespace
  const cleanString = aiResponseString
    .replace(/```json/gi, '') // Remove opening fence
    .replace(/```/g, '')      // Remove closing fence
    .trim();                  // Remove leading/trailing whitespace

  try {
    // 3. Convert string to actual JSON Object
    return JSON.parse(cleanString);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return null; // or handle error appropriately
  }
};

module.exports = { GeminiCall ,Getprompt , cleanAndParseJSON }


