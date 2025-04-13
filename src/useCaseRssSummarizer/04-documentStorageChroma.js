// =============================================================
// PART 4: DOCUMENT STORAGE @alex
// =============================================================

// Vector Database Integration (Chroma)
const { Chroma } = require("@langchain/community/vectorstores/chroma");

async function setupChromaDB(texts, embeddings) {
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
