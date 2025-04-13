// =============================================================
// PART 1: FIRST CALL TO LLM (10 min) - @pavlik
// =============================================================

// Basic OpenAI API Call
const { OpenAI } = require("openai");

async function firstLLMCall() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is RAG and why is it useful?" },
      ],
      temperature: 0.7,
    });

    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
  }
}

firstLLMCall();
