// =============================================================
// PART 1: FIRST CALL TO LLM (10 min) - @pavlik
// =============================================================

// Basic Ollama API Call
const { default: ollama } = require("ollama");

async function firstLLMCall() {
  // Create an Ollama client
  try {
    const response = await ollama.chat({
      model: "tinyllama:1.1b", // Using the tiny LLM model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "What is retrieval-augmented generation and why is it useful?",
        },
      ],
      temperature: 0.7,
    });

    console.log(response.message.content);
    return response.message.content;
  } catch (error) {
    console.error("Error calling Ollama:", error);
  }
}

firstLLMCall();
