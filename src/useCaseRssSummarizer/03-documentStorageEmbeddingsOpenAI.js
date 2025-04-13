// =============================================================
// PART 4: DOCUMENT STORAGE @alex
// =============================================================

// Embeddings Generation
const { OpenAIEmbeddings } = require("@langchain/openai");

async function generateEmbeddingsOpenAI(texts) {
  const embeddings = new OpenAIEmbeddings({
    modelName: "text-embedding-ada-002",
  });

  try {
    return await embeddings.embedDocuments(texts);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return [];
  }
}

const getEmbedModel = async () => {
  return new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

// Export functions for workshop modules
module.exports = {
  generateEmbeddings,
  getEmbedModel,
};
