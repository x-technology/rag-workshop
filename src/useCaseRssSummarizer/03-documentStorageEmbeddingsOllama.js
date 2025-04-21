// =============================================================
// PART 4: DOCUMENT STORAGE @alex
// $ pip install chromadb==0.6.3
// =============================================================

// Embeddings Generation
const { OllamaEmbeddings } = require("@langchain/ollama");

const getEmbedModel = () => {
  return new OllamaEmbeddings({
    baseUrl: "http://127.0.0.1:11434",
    model: "nomic-embed-text", // A small embedding model in Ollama
  });
};

async function generateEmbeddings(texts) {
  const embeddings = getEmbedModel();

  try {
    return await embeddings.embedDocuments(texts);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return [];
  }
}

// Export functions for workshop modules
module.exports = {
  getEmbedModel,
  generateEmbeddings,
};
