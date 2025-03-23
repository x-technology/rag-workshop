// Simple Chat Implementation
const readline = require("readline");

async function simpleChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const chatHistory = [
    {
      role: "system",
      content: "You are a helpful assistant specializing in RAG systems.",
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
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: chatHistory,
          temperature: 0.7,
        });

        const aiResponse = response.choices[0].message.content;
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

// Export functions for workshop modules
module.exports = {
  simpleChat,
};
