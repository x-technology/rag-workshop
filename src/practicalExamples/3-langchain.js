// Basic LangChain Example
const { ChatOpenAI } = require("@langchain/openai");
const { ConversationChain } = require("langchain/chains");
const { BufferMemory } = require("langchain/memory");

async function langchainBasic() {
  const chat = new ChatOpenAI({
    temperature: 0.7,
    modelName: "gpt-4",
  });

  const memory = new BufferMemory();
  const chain = new ConversationChain({
    llm: chat,
    memory: memory,
  });

  const result1 = await chain.call({ input: "What is RAG?" });
  console.log(result1.response);

  const result2 = await chain.call({
    input: "Why is it useful for document retrieval?",
  });
  console.log(result2.response);
}

// Export functions for workshop modules
module.exports = {
  langchainBasic,
};
