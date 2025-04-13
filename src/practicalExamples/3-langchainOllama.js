// Basic LangChain Example
const { ChatOllama } = require("@langchain/ollama");
const { ConversationChain } = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");

async function langchain() {
  // Initialize Ollama chat model
  const chat = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default Ollama server address
    model: "tinyllama:1.1b", // Using the smallest model as requested
    temperature: 0.7,
  });

  // Setup memory and conversation chain
  const memory = new BufferMemory();
  const chain = new ConversationChain({
    llm: chat,
    memory: memory,
  });

  // First interaction
  const result1 = await chain.call({ input: "What is RAG?" });
  console.log(result1.response);

  // Follow-up question (memory will retain context from first question)
  const result2 = await chain.call({
    input: "Why is it useful for document retrieval?",
  });
  console.log(result2.response);
}

langchain();
