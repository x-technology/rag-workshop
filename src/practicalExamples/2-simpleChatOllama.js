// Simple Chat Implementation
const readline = require("readline");
const { default: ollama } = require("ollama");

async function simpleChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const chatHistory = [
    {
      role: "system",
      content:
        "You are a helpful assistant specializing in retrieval-augmented generation systems.",
    },
  ];

  console.log("Chat with the AI (type 'exit' to quit):");

  const askQuestion = () => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      chatHistory.push({ role: "user", content: input });

      try {
        const response = await ollama.chat({
          model: "tinyllama:1.1b", // Using the tiny LLM model
          messages: chatHistory,
          temperature: 0.7,
        });

        const aiResponse = response.message.content;
        console.log(`AI: ${aiResponse}`);

        chatHistory.push({ role: "assistant", content: aiResponse });
        askQuestion();
      } catch (error) {
        console.error("Error:", error);
        askQuestion();
      }
    });
  };

  askQuestion();
}

simpleChat();
