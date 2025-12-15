const {
  Getprompt,
  GeminiCall,
  cleanAndParseJSON,
  getRentServices,
  GetBudgetPropertyService,
  GetCategoryPropertyService,
} = require("../services/geminiService");

const PropertyVerifiedAi = async (req, res) => {
  try {
    const { mode, answers, questions } = req.body;
    console.log(mode, answers, questions);

    if (mode == "budget") {
      const prompt = Getprompt(mode, answers, questions);

      const Geminiresponse = await GeminiCall(prompt);

      const cleanResponse = cleanAndParseJSON(Geminiresponse);

      const { data: BudgetProperties, error } = await GetBudgetPropertyService(
        cleanResponse.safe_purchase_limit
      );

      if (error) {
        console.log("Error Occurs in  Getting in the Budget Property", error);
      }

      res.json({
        message: "User created successfully",
        cleanResponse,
        BudgetProperties,
      });
    } else if (mode == "rent") {
      const cleanResponse = await getRentServices(answers);

      res.json({ message: "Rent match successfully", cleanResponse });
    } else if (mode == "category") {
      const prompt = Getprompt(mode, answers, questions);
      const Geminiresponse = await GeminiCall(prompt);
      const cleanResponse = cleanAndParseJSON(Geminiresponse);

       const { data: CategoryProperties, error } = await GetCategoryPropertyService (
        cleanResponse.area , answers[0]
      );

      if (error) {
        console.log("Error Occurs in  Getting in the Budget Property", error);
      }

      console.log(CategoryProperties)
      
      res.json({ message: " Category match successfully", cleanResponse ,CategoryProperties });
    } else if (mode == "discuss") {
      const prompt = Getprompt(mode, answers, questions);
      const Geminiresponse = await GeminiCall(prompt);
      const cleanResponse = cleanAndParseJSON(Geminiresponse);

      res.json({ message: "Rent match successfully", cleanResponse });
    } else {
      return res.status(400).json({ error: "Invalid mode" });
    }
  } catch (err) {
    res.status(500).json({ error: "error in the response" });
  }
};

module.exports = { PropertyVerifiedAi };
