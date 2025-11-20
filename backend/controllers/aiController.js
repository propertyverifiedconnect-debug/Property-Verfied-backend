const {
  Getprompt,
  GeminiCall,
  cleanAndParseJSON,
  getRentServices,
} = require("../services/geminiService");

const PropertyVerifiedAi = async (req, res) => {
  try {
    const { mode, answers, questions } = req.body;
     console.log(mode, answers, questions)

    if (mode == "budget") {
      const prompt = Getprompt(mode, answers, questions);

      const Geminiresponse = await GeminiCall(prompt);

      const cleanResponse = cleanAndParseJSON(Geminiresponse);
      res.json({ message: "User created successfully", cleanResponse });
    } else if (mode == "rent") {
      const data = await getRentServices(answers);
      console.log(data);
      res.json({ message: "Rent match successfully" });

    }else if (mode == "category") {
      const prompt = Getprompt(mode, answers, questions);
      const Geminiresponse = await GeminiCall(prompt);    
      const cleanResponse = cleanAndParseJSON(Geminiresponse);
      res.json({ message: "Rent match successfully" , cleanResponse });
    }
    
    
    else {
      return res.status(400).json({ error: "Invalid mode" });
    }
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

module.exports = { PropertyVerifiedAi };
