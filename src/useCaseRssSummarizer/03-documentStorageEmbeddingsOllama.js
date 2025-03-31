// =============================================================
// PART 4: DOCUMENT STORAGE (30 min) - @alex
// =============================================================

// Embeddings Generation
const { OllamaEmbeddings } = require("@langchain/ollama");

async function generateEmbeddings(texts, model = "nomic-embed-text") {
  const embeddings = new OllamaEmbeddings({
    baseUrl: "http://localhost:11434", // Default Ollama local server
    model: model,
  });

  try {
    return await embeddings.embedDocuments(texts);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return [];
  }
}

const getEmbedModel = () => {
  return new OllamaEmbeddings({
    baseUrl: "http://localhost:11434",
    model: "nomic-embed-text", // A small embedding model in Ollama
  });
};

// Export functions for workshop modules
module.exports = {
  generateEmbeddings,
  getEmbedModel,
};
