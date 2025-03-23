// =============================================================
// PART 4: DOCUMENT STORAGE (30 min) - @alex
// =============================================================

// Embeddings Generation
const { OpenAIEmbeddings } = require("@langchain/openai");

async function generateEmbeddings(texts) {
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

// Export functions for workshop modules
module.exports = {
  generateEmbeddings,
};
