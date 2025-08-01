// =============================================================
// PART 4: DOCUMENT STORAGE @alex
// =============================================================

// Vector Database Integration (Chroma)
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { ChromaClient } = require("chromadb");

async function setupChromaDB(texts, embeddings) {
  // Delete the existing collection first because when the model is switched, it's dimensionality differs
  const chromaClient = new ChromaClient({
    path: "http://localhost:8000", // Default ChromaDB server address
  });

  try {
    // clear existing models to be able to put records with a different model
    await chromaClient.deleteCollection({
      name: "rag_node_workshop_articles",
    });
  } catch {}
  await chromaClient.createCollection({
    name: "rag_node_workshop_articles",
    metadata: {
      description: "RSS feed articles for RAG workshop",
    },
  });

  const vectorStore = await Chroma.fromTexts(
    texts,
    { id: Array.from({ length: texts.length }, (_, i) => `chunk-${i}`) },
    embeddings,
    {
      collectionName: "rag_node_workshop_articles",
    },
  );

  console.log(`Created Chroma collection with ${texts.length} documents`);
  return vectorStore;
}

async function searchChromaDB(vectorStore, query, k = 3) {
  const results = await vectorStore.similaritySearch(query, k);
  return results;
}

// Export functions for workshop modules
module.exports = {
  setupChromaDB,
  searchChromaDB,
};
