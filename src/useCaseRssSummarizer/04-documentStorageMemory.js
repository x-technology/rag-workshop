// =============================================================
// PART 4: DOCUMENT STORAGE @alex
// =============================================================

// In-memory Vector Store
class SimpleVectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
  }

  async addDocuments(texts, embeddings) {
    for (let i = 0; i < texts.length; i++) {
      this.documents.push(texts[i]);
      this.embeddings.push(embeddings[i]);
    }
    console.log(`Added ${texts.length} documents to the vector store`);
  }

  async similaritySearch(query, embeddingModel, k = 3) {
    // Generate embedding for the query
    const queryEmbedding = await embeddingModel.embedQuery(query);

    // Calculate cosine similarity
    const similarities = this.embeddings.map((embedding) => {
      return this.cosineSimilarity(queryEmbedding, embedding);
    });

    // Get top k results
    const indexSimilarityPairs = similarities.map((similarity, index) => ({
      index,
      similarity,
    }));

    const topResults = indexSimilarityPairs
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);

    return topResults.map((result) => ({
      document: this.documents[result.index],
      similarity: result.similarity,
    }));
  }

  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    return dotProduct / (normA * normB);
  }
}

// Export functions for workshop modules
module.exports = {
  SimpleVectorStore,
};
