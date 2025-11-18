const { Getprompt, GeminiCall, cleanAndParseJSON } = require("../services/geminiService");

const PropertyVerifiedAi = async (req, res) => {
  try {

    const {mode , answers ,questions } = req.body 

    const prompt = Getprompt(mode ,answers,questions);

   const Geminiresponse = await GeminiCall(prompt)
 
   const cleanResponse = cleanAndParseJSON(Geminiresponse)


   
    res.json({ message: 'User created successfully' , cleanResponse });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

module.exports = {PropertyVerifiedAi}